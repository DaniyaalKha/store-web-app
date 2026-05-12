import Header from './components/Header';
import Footer from './components/Footer';


export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      {/* text section */}
      <section className="px-4 mb-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Welcome to Daniyaal's Tech Store
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Build your dream setup with high-performance PC parts at unbeatable prices. From gaming rigs to professional workstations, we stock the latest components, trusted brands, and everything you need to power your next build.
          </p>
        </div>
      </section>

     
    </div>
  );
}
