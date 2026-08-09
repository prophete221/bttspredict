import { VipCardGrid } from '@/components/bttsbet/VipCardGlass'
import PromoVip from '@/components/bttsbet/PromoVip'
import { SITE, AFFILIATE } from '@/lib/constants'
export default function VipPage(){
  return(<main className="min-h-screen bg-[#07111A] pt-20 pb-10">
    <section className="max-w-5xl mx-auto px-4 text-center mb-6">
      <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold tracking-widest border" style={{background:'rgba(212,175,55,0.1)',color:'#C7F464',borderColor:'rgba(212,175,55,0.3)'}}>★ PROGRAMME VIP PREMIUM • FRAIS DU JOUR</span>
      <h1 className="text-3xl md:text-4xl font-bold mt-4" style={{color:'#F2F7F5'}}>Cartes VIP • Contenu réel frais</h1>
      <p className="text-sm mt-2 max-w-xl mx-auto" style={{color:'#B5C4C9'}}>Pas de blabla. 4 offres + 6 matchs frais du jour (équipes visibles, pronos floutés). Débloque pour voir le frais.</p>
    </section>
    <section className="max-w-5xl mx-auto px-4 mb-8"><VipCardGrid /></section>
    <section className="max-w-5xl mx-auto px-4 mb-8"><PromoVip /></section>
    <section className="max-w-3xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
      <div className="rounded-[14px] p-4 border" style={{background:'#102333',borderColor:'#1C3546'}}><p className="text-[11px] font-bold tracking-widest" style={{color:'#7F969E'}}>ÉTAPE 1</p><p className="font-bold mt-1" style={{color:'#F2F7F5'}}>Inscris-toi avec VISION221</p><a href={AFFILIATE.linebet} target="_blank" rel="sponsored nofollow" className="inline-block mt-2 px-4 py-2 rounded-full text-[12px] font-bold" style={{background:'#C7F464',color:'#07111A'}}>S'inscrire</a></div>
      <div className="rounded-[14px] p-4 border" style={{background:'#102333',borderColor:'#1C3546'}}><p className="text-[11px] font-bold tracking-widest" style={{color:'#7F969E'}}>ÉTAPE 2</p><p className="font-bold mt-1" style={{color:'#F2F7F5'}}>Dépose 3000F / 12000F</p><p className="text-[11px] mt-1" style={{color:'#B5C4C9'}}>Reçois ID Linebet</p></div>
      <div className="rounded-[14px] p-4 border" style={{background:'#102333',borderColor:'#1C3546'}}><p className="text-[11px] font-bold tracking-widest" style={{color:'#7F969E'}}>ÉTAPE 3</p><p className="font-bold mt-1" style={{color:'#F2F7F5'}}>Envoie ID sur WhatsApp</p><a href="https://wa.me/15406704172" target="_blank" className="inline-block mt-2 px-4 py-2 rounded-full text-[12px] font-bold border" style={{borderColor:'#63D6FF',color:'#63D6FF'}}>WhatsApp</a></div>
    </section>
    <section className="max-w-3xl mx-auto px-4 text-center"><p className="text-[11px] leading-relaxed" style={{color:'#7F969E'}}>Lien d'affiliation rémunéré. BTTSPredict ne prend pas de paris et ne collecte pas de fonds. 18+ • Aucun gain garanti • Contenu frais du jour généré depuis predictions.json + fallback réel. Code VISION221 (Linebet) / vision221 (888starz).</p></section>
  </main>)
}
