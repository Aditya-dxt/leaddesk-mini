import { LeadForm } from "@/components/LeadForm";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 md:p-12 lg:p-24 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-accent/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent/5 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center z-10">
        
        {/* Hero Section */}
        <div className="space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-sm font-medium text-accent mb-4">
            <span className="flex h-2 w-2 rounded-full bg-accent mr-2"></span>
            Accepting new projects
          </div>
          
          <h1 className="text-5xl md:text-7xl font-display font-extrabold tracking-tight text-foreground leading-[1.1]">
            Build products that <span className="text-accent">demand attention.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            We are an award-winning digital agency crafting premium web experiences for ambitious brands. Stop blending in and start standing out.
          </p>
          
          <div className="pt-4 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-muted overflow-hidden">
                  <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="Client Avatar" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">Trusted by 100+ innovative brands</p>
          </div>
        </div>

        {/* Lead Form Section */}
        <div className="w-full max-w-md mx-auto lg:ml-auto lg:mr-0">
          <LeadForm />
        </div>
        
      </div>
    </main>
  );
}
