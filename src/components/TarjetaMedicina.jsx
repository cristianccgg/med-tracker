import { useState } from "react";

const inputClase =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:border-slate-500 focus:outline-none";

function SlotDosis({
  medicina,
  tipoDosis,
  etiqueta,
  onCambiarDosis,
  onMarcarDosis,
  onEditarDosisCompletada,
}) {
  const [editando, setEditando] = useState(false);
  const [horaEdicion, setHoraEdicion] = useState("");
  const [fechaEdicion, setFechaEdicion] = useState("");

  const fechaSeleccionada = medicina.horasDosis[tipoDosis].fecha;

  const dosisDeHoy = medicina.fechasCompletado.find(
    (dosis) => dosis.dosis === tipoDosis && dosis.fecha === fechaSeleccionada,
  );

  if (dosisDeHoy && editando) {
    return (
      <div className="flex-1 space-y-2 rounded-lg bg-slate-50 p-3">
        <span className="text-sm font-medium text-slate-600">{etiqueta}</span>
        <input
          value={horaEdicion}
          onChange={(e) => setHoraEdicion(e.target.value)}
          type="time"
          className={inputClase}
        />
        <input
          value={fechaEdicion}
          onChange={(e) => setFechaEdicion(e.target.value)}
          type="date"
          className={inputClase}
        />
        <div className="flex gap-2">
          <button
            onClick={() => {
              onEditarDosisCompletada(
                medicina.id,
                tipoDosis,
                dosisDeHoy.fecha,
                horaEdicion,
                fechaEdicion,
              );
              setEditando(false);
            }}
            className="flex-1 rounded-lg bg-emerald-600 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
          >
            Guardar
          </button>
          <button
            onClick={() => setEditando(false)}
            className="rounded-lg px-3 py-2 text-sm text-slate-500 hover:bg-slate-100"
          >
            Cancelar
          </button>
        </div>
      </div>
    );
  }

  if (dosisDeHoy) {
    return (
      <div className="flex-1 space-y-1 rounded-lg bg-emerald-50 p-3">
        <span className="text-sm font-medium text-slate-600">{etiqueta}</span>
        <p className="font-medium text-emerald-700">
          ✓ Dada — {dosisDeHoy.hora}
        </p>
        <button
          onClick={() => {
            setHoraEdicion(dosisDeHoy.hora);
            setFechaEdicion(dosisDeHoy.fecha);
            setEditando(true);
          }}
          className="text-sm text-slate-400 underline hover:text-slate-600"
        >
          editar
        </button>
      </div>
    );
  }

  const { hora, fecha } = medicina.horasDosis[tipoDosis];

  return (
    <div className="flex-1 space-y-2 rounded-lg bg-slate-50 p-3">
      <span className="text-sm font-medium text-slate-600">{etiqueta}</span>
      <input
        value={hora}
        onChange={(e) =>
          onCambiarDosis(medicina.id, tipoDosis, e.target.value, fecha)
        }
        type="time"
        className={inputClase}
      />
      <input
        value={fecha}
        onChange={(e) =>
          onCambiarDosis(medicina.id, tipoDosis, hora, e.target.value)
        }
        type="date"
        className={inputClase}
      />
      <button
        onClick={() => onMarcarDosis(medicina.id, tipoDosis, hora, fecha)}
        className="w-full rounded-lg bg-emerald-600 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
      >
        Marcar {etiqueta}
      </button>
    </div>
  );
}

function TarjetaMedicina({
  medicina,
  onEliminar,
  onCambiarDosis,
  onMarcarDosis,
  onEditarDosisCompletada,
}) {
  return (
    <div className="space-y-3 rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-semibold text-slate-800">{medicina.nombre}</p>
          <p className="text-sm text-slate-500">
            Día 1 de {medicina.duracion} · Cada{" "}
            {medicina.frecuencia === "12h" ? "12 horas" : "24 horas"}
          </p>
          <p className="text-sm text-slate-500">
            Fecha Inicio: {medicina.fechaInicio}
          </p>
        </div>
        <button
          onClick={() => onEliminar(medicina.id)}
          className="rounded-full px-2 py-1 text-sm text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        >
          X
        </button>
      </div>
      {medicina.frecuencia === "12h" ? (
        <div className="flex gap-3">
          <SlotDosis
            medicina={medicina}
            tipoDosis="dosis1"
            etiqueta="Dosis AM"
            onCambiarDosis={onCambiarDosis}
            onMarcarDosis={onMarcarDosis}
            onEditarDosisCompletada={onEditarDosisCompletada}
          />
          <SlotDosis
            medicina={medicina}
            tipoDosis="dosis2"
            etiqueta="Dosis PM"
            onCambiarDosis={onCambiarDosis}
            onMarcarDosis={onMarcarDosis}
            onEditarDosisCompletada={onEditarDosisCompletada}
          />
        </div>
      ) : (
        <SlotDosis
          medicina={medicina}
          tipoDosis="dosis1"
          etiqueta="Dosis hoy"
          onCambiarDosis={onCambiarDosis}
          onMarcarDosis={onMarcarDosis}
          onEditarDosisCompletada={onEditarDosisCompletada}
        />
      )}
    </div>
  );
}

export default TarjetaMedicina;
