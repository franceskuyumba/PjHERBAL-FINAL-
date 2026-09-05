import EditableImage from "@/components/EditableImage";

export default function HomePage() {
  return (
    <main className="min-h-screen pb-20 bg-gray-50">
      {/* Category Section */}
      <section className="p-4">
        <h2 className="text-xs font-bold tracking-wider text-amber-700 uppercase">Shop By Category</h2>
        <h1 className="text-2xl font-serif font-bold text-gray-900 mb-4">Find what your body needs</h1>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="relative rounded-2xl overflow-hidden h-36 bg-emerald-900 text-white p-3 flex flex-col justify-between">
            <EditableImage sectionKey="cat_mens_health" defaultSrc="/images/mens-health.jpg" alt="Men's Health" isAdmin={true} className="absolute inset-0 z-0 opacity-40" />
            <div className="relative z-10">
              <h3 className="font-bold text-sm">Men's Health</h3>
              <p className="text-[10px] text-gray-200">Support vitality, stamina and prostate wellbeing.</p>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden h-36 bg-emerald-900 text-white p-3 flex flex-col justify-between">
            <EditableImage sectionKey="cat_weight_mgnt" defaultSrc="/images/weight-management.jpg" alt="Weight Management" isAdmin={true} className="absolute inset-0 z-0 opacity-40" />
            <div className="relative z-10">
              <h3 className="font-bold text-sm">Weight Management</h3>
              <p className="text-[10px] text-gray-200">Natural support for healthy weight loss journeys.</p>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden h-36 bg-emerald-900 text-white p-3 flex flex-col justify-between">
            <EditableImage sectionKey="cat_energy_imm" defaultSrc="/images/energy-immunity.jpg" alt="Energy & Immunity" isAdmin={true} className="absolute inset-0 z-0 opacity-40" />
            <div className="relative z-10">
              <h3 className="font-bold text-sm">Energy & Immunity</h3>
              <p className="text-[10px] text-gray-200">Daily power, stronger defenses and vitality.</p>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden h-36 bg-emerald-900 text-white p-3 flex flex-col justify-between">
            <EditableImage sectionKey="cat_womens_well" defaultSrc="/images/womens-wellness.jpg" alt="Women's Wellness" isAdmin={true} className="absolute inset-0 z-0 opacity-40" />
            <div className="relative z-10">
              <h3 className="font-bold text-sm">Women's Wellness</h3>
              <p className="text-[10px] text-gray-200">Nourishment and balance for every stage.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Banner Section */}
      <section className="p-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold text-gray-900">Energy & Immunity</h2>
          <span className="text-xs text-emerald-800 font-semibold">View all products ?</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 p-2">
            <EditableImage sectionKey="prod_kaa_fit" defaultSrc="/images/kaa-fit.jpg" alt="Kaa Fit Bila Stress" isAdmin={true} className="h-32 w-full rounded-lg" />
            <p className="text-xs font-bold mt-2 text-gray-800">Kaa Fit Bila Stress!</p>
          </div>

          <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 p-2">
            <EditableImage sectionKey="prod_moyo_health" defaultSrc="/images/moyo-health.jpg" alt="Msaada kwa Afya ya Moyo" isAdmin={true} className="h-32 w-full rounded-lg" />
            <p className="text-xs font-bold mt-2 text-gray-800">Msaada Kwa Afya Ya Moyo</p>
          </div>
        </div>
      </section>
    </main>
  );
}
