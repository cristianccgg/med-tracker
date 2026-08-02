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
          const nuevaDosis = {
            fecha,
            dosis: tipoDosis,
            hora,
          };

          return {
            ...medicina,
            fechasCompletado: [...medicina.fechasCompletado, nuevaDosis],
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

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-md space-y-6">
        <header>
          <h1 className="text-2xl font-bold text-slate-800">Medicinas</h1>
        </header>

        <FormularioMedicina
          datosFormulario={datosFormulario}
          setDatosFormulario={setDatosFormulario}
          onSubmit={agregarMedicina}
        />

        <section className="space-y-3">
          {medicinas.map((medicina) => (
            <TarjetaMedicina
              key={medicina.id}
              medicina={medicina}
              onEliminar={eliminarMedicina}
              onCambiarDosis={cambiarDosis}
              onMarcarDosis={marcarDosis}
              onEditarDosisCompletada={editarDosisCompletada}
            />
          ))}
        </section>
      </div>
    </div>
  );
}

export default App;
