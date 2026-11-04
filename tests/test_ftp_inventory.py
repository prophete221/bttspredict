import importlib.util
import json
from pathlib import Path
import tempfile
import unittest
from unittest import mock

SCRIPT = Path(__file__).parents[1] / 'scripts/ftp-inventory.py'
SPEC = importlib.util.spec_from_file_location('ftp_inventory', SCRIPT)
inventory_module = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(inventory_module)


class FakeFTP:
    def __init__(self, payloads):
        self.payloads = payloads
        self.commands = []

    def retrbinary(self, command, callback):
        self.commands.append(command)
        name = command.removeprefix('RETR ')
        if name not in self.payloads:
            raise AssertionError(f'Unexpected RETR command: {command}')
        callback(self.payloads[name])


class InventoryBackupTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.backup_dir = str(Path(self.temp.name) / 'predeploy-backups')
        self.payloads = {
            '.htaccess': b'Options -Indexes\n',
            'robots.txt': b'User-agent: *\nDisallow:\n',
            'sitemap.xml': b'<urlset></urlset>\n',
            'deploy-manifest.json': b'{"fileCount":0,"files":{}}',
        }
        self.inv = inventory_module.Inventory(
            'example.invalid', 21, 'user', 'password', timeout=1, retries=1,
            delay=0, out_dir=self.temp.name, dual_first_level=False,
            save_manifest='', save_root_backups=self.backup_dir,
        )
        self.addCleanup(lambda: self.inv._err.close() if not self.inv._err.closed else None)
        self.inv.ftp = FakeFTP(self.payloads)
        self.inv.root_entries = {
            name: {'present': True, 'size': len(payload)}
            for name, payload in self.payloads.items()
        }

    def test_saves_only_the_three_allowlisted_root_backups_and_checks_sizes(self):
        self.inv.save_root_backups_files()
        self.assertEqual(self.inv.ftp.commands, [
            'RETR .htaccess', 'RETR robots.txt', 'RETR sitemap.xml',
        ])
        for name in ('.htaccess', 'robots.txt', 'sitemap.xml'):
            self.assertEqual((Path(self.backup_dir) / name).read_bytes(), self.payloads[name])
        self.assertEqual(self.inv.capabilities['rootBackupsSaved'], ['.htaccess', 'robots.txt', 'sitemap.xml'])
        with self.assertRaises(ValueError):
            self.inv.retrieve_root_file('../outside.txt')

    def test_mismatched_remote_size_fails_closed_without_partial_backups(self):
        self.inv.root_entries['robots.txt']['size'] += 1
        self.inv.save_root_backups_files()
        self.assertFalse(self.inv.capabilities['rootBackupsSaved'])
        self.assertEqual(len(self.inv.read_failures), 1)
        self.assertFalse((Path(self.backup_dir) / '.htaccess').exists())
        self.assertFalse((Path(self.backup_dir) / 'robots.txt').exists())

    def test_read_failure_stops_before_recursive_walk(self):
        self.inv.read_failures.append({'path': 'sitemap.xml', 'op': 'RETR', 'error': 'synthetic failure'})
        self.inv.probe_capabilities = lambda: None
        with mock.patch.object(self.inv, 'walk') as walk:
            result = self.inv.run()
        self.assertEqual(result, 1)
        walk.assert_not_called()
        summary = json.loads((Path(self.temp.name) / 'remote-inventory-summary.json').read_text())
        self.assertFalse(summary['complete'])
        self.assertEqual(summary['readFailures'][0]['path'], 'sitemap.xml')


if __name__ == '__main__':
    unittest.main()
