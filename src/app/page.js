
import EntregaForm from "./components/EntregaForm";
import TablaResumen from "./components/TablaResumen";
import { LibreBarcode } from "./ui/fonts";
export default function Home() {
  return (
    
    <fragment className='grid md:grid-cols-3 auto-rows-min justify-center bg-[#111917] md:m-8 m-2 rounded-xl' >
      <main className="grid auto-rows-min gap-2 border-4 border-[#49655d]  rounded-xl col-span-1 flex-col items-center justify-center p-12 mx-12 my-12 justify-items-center">
        <h1 className={` ${LibreBarcode.className}  text-6xl font-bold text-center`}>
          100 Registros
        </h1>
        <p className={`text-center`}>
          ¡Bienvenido a 100 Registros!
        </p>
        <div className=""> <EntregaForm /> </div>
      </main>
      <section className="grid md:col-span-2">
      <div className="text-center md:mt-12 mt-16">
        <h1 className="mb-4 text-3xl">RESUMEN </h1>
        <TablaResumen/>
      </div>
      </section>
    </fragment>
  );
}
