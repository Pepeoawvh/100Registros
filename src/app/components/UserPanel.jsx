import React from 'react'

const UserPanel = () => {
  return (
    <div>
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
      <TablaResumen/>
    </div>
    </section>
  </div>
  )
}

export default UserPanel