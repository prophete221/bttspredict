# BACKUP — BttsBet NOVA PRIME v13
## Date: 17 Juillet 2026

### Restauration

Pour restaurer cette version, exécuter:

```bash
# Méthode 1: Via git tag (recommandé)
cd /home/z/my-project
git checkout backup-NOVA-PRIME-v13-2026-07-17

# Méthode 2: Via copie de fichiers
cd /home/z/my-project
cp -r backups/NOVA-PRIME-v13-2026-07-17/src/ src/
cp -r backups/NOVA-PRIME-v13-2026-07-17/public/ public/
cp backups/NOVA-PRIME-v13-2026-07-17/package.json package.json
cp backups/NOVA-PRIME-v13-2026-07-17/next.config.ts next.config.ts
cp backups/NOVA-PRIME-v13-2026-07-17/tailwind.config.ts tailwind.config.ts
# ... copier les autres fichiers selon les besoins
```

### Version Info
- **Git Commit**: e37f0f52
- **Git Tag**: backup-NOVA-PRIME-v13-2026-07-17
- **Design**: NOVA PRIME v13 — Living Site
- **Couleurs**: Emerald #FF6B2B, Ultra #22D3EE, Gold #FACC15, Success #4ADE80
- **Boutons**: Pill-shaped, flat solid colors, compact mobile
- **Animations**: Blur+scale scroll reveals, floating particles, 3D effects, animated icons
- **Sections**: Navbar, Hero, AviatorVip, FreePredictions, PromoVip, VipSports, WinHistory, FifaLinebet, Footer
- **Partenaires**: Linebet (Btts365/VISION221), 888starz (Btts888)
- **Site**: bttsbet.online
