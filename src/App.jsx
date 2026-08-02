import { useEffect, useState } from "react";
import "./App.css";
import FormularioMedicina from "./components/FormularioMedicina";
import TarjetaMedicina from "./components/TarjetaMedicina";

const ahora = new Date();

const fechaHoy = `${ahora.getFullYear()}-${String(
  ahora.getMonth() + 1,
).padStart(2, "0")}-${String(ahora.getDate()).padStart(2, "0")}`;

const horaActual = `${String(ahora.getHours()).padStart(2, "0")}:${String(
  ahora.getMinutes(),
).padStart(2, "0")}`;

function App() {
  const [medicinas, setMedicinas] = useState(() => {
    const guardados = localStorage.getItem("medicinas");

    if (guardados) {
      return JSON.parse(guardados);
    } else {
      return [];
    }
  });
  const [datosFormulario, setDatosFormulario] = useState({
    nombre: "",
    frecuencia: "",
    duracion: "",
    fechaInicio: fechaHoy,
  });

  useEffect(() => {
    localStorage.setItem("medicinas", JSON.stringify(medicinas));
  }, [medicinas]);

  const agregarMedicina = (datosFormulario) => {
    if (
      datosFormulario.nombre.trim() !== "" &&
      datosFormulario.frecuencia !== "" &&
      datosFormulario.duracion !== ""
    ) {
      const nuevaMedicina = {
        id: crypto.randomUUID(),
        nombre: datosFormulario.nombre,
        frecuencia: datosFormulario.frecuencia,
        duracion: datosFormulario.duracion,
        fechaInicio: datosFormulario.fechaInicio,
        horasDosis: {
          dosis1: {
            hora: horaActual,
            fecha: datosFormulario.fechaInicio,
          },
          dosis2: {
            hora: horaActual,
            fecha: datosFormulario.fechaInicio,
          },
        },
        fechasCompletado: [],
      };
      setMedicinas((prevMedicinas) => [...prevMedicinas, nuevaMedicina]);
      setDatosFormulario({
        nombre: "",
        frecuencia: "",
        duracion: "",
      });
    }
  };

  const eliminarMedicina = (id) => {
    setMedicinas((prevMedicinas) =>
      prevMedicinas.filter((medicina) => medicina.id !== id),
    );
  };

  const cambiarDosis = (id, tipoDosis, hora, fecha) => {
    setMedicinas((prevMedicinas) =>
      prevMedicinas.map((med) =>
        med.id === id
          ? {
              ...med,
              horasDosis: {
                ...med.horasDosis,
                [tipoDosis]: {
                  ...med.horasDosis[tipoDosis],
                  hora: hora,
                  fecha: fecha,
                },
              },
            }
          : med,
      ),
    );
  };

  const marcarDosis = (id, tipoDosis, hora, fecha) => {
    setMedicinas((prevMedicinas) =>
      prevMedicinas.map((medicina) => {
        if (medicina.id === id) {
          const yaRegistrada = medicina.fechasCompletado.some(
            (dosis) => dosis.dosis === tipoDosis && dosis.fecha === fecha,
          );

          if (yaRegistrada) {
            return medicina;
          }

          const nuevaDosis = {
            fecha,
            dosis: tipoDosis,
            hora,
          };

          return {
            ...medicina,
            fechasCompletado: [...medicina.fechasCompletado, nuevaDosis],
            horasDosis: {
              ...medicina.horasDosis,
              [tipoDosis]: {
                hora: horaActual,
                fecha: fechaHoy,
              },
            },
          };
        }

        return medicina;
      }),
    );
  };

  const editarDosisCompletada = (id, tipoDosis, fechaOriginal, hora, fecha) => {
    setMedicinas((prevMedicinas) =>
      prevMedicinas.map((medicina) => {
        if (medicina.id === id) {
          return {
            ...medicina,
            fechasCompletado: medicina.fechasCompletado.map((dosis) =>
              dosis.dosis === tipoDosis && dosis.fecha === fechaOriginal
                ? { ...dosis, hora, fecha }
                : dosis,
            ),
          };
        }

        return medicina;
      }),
    );
  };

  const diasTranscurridosDesde = (fechaInicio) => {
    const [anio, mes, dia] = fechaInicio.split("-").map(Number);
    const inicio = new Date(anio, mes - 1, dia);
    const [anioHoy, mesHoy, diaHoy] = fechaHoy.split("-").map(Number);
    const hoy = new Date(anioHoy, mesHoy - 1, diaHoy);

    const diferencia = hoy - inicio;

    return Math.floor(diferencia / (1000 * 60 * 60 * 24));
  };

  const calcularDiaTratamiento = (fechaInicio, duracion) => {
    const diasTranscurridos = diasTranscurridosDesde(fechaInicio);

    return Math.min(Math.max(diasTranscurridos + 1, 1), duracion);
  };

  const tratamientoCompletado = (fechaInicio, duracion) => {
    const diasTranscurridos = diasTranscurridosDesde(fechaInicio);

    return diasTranscurridos + 1 > Number(duracion);
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header>
          <h1 className="text-2xl font-bold text-slate-800">Medicinas</h1>
          <p className="text-sm text-slate-500">
            Control de tratamientos y dosis
          </p>
        </header>

        <details className="group max-w-md rounded-xl bg-white shadow-sm ring-1 ring-slate-200 open:pb-2">
          <summary className="cursor-pointer list-none px-5 py-4 text-sm font-medium text-slate-600 hover:text-slate-800">
            <span className="mr-1 inline-block transition-transform group-open:rotate-90">
              ›
            </span>
            {medicinas.length === 0
              ? "Registrar tu primera medicina"
              : "Agregar otra medicina"}
          </summary>
          <div className="px-5">
            <FormularioMedicina
              datosFormulario={datosFormulario}
              setDatosFormulario={setDatosFormulario}
              onSubmit={agregarMedicina}
              fechaHoy={fechaHoy}
            />
          </div>
        </details>

        {medicinas.length > 0 && (
          <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {medicinas.map((medicina) => (
              <TarjetaMedicina
                key={medicina.id}
                medicina={medicina}
                fechaHoy={fechaHoy}
                onEliminar={eliminarMedicina}
                onCambiarDosis={cambiarDosis}
                onMarcarDosis={marcarDosis}
                onEditarDosisCompletada={editarDosisCompletada}
                calcularDiaTratamiento={calcularDiaTratamiento}
                tratamientoCompletado={tratamientoCompletado}
              />
            ))}
          </section>
        )}
      </div>
    </div>
  );
}

export default App;
