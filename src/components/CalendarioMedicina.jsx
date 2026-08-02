import { useState } from "react";

function sumarDias(fechaISO, dias) {
  const [anio, mes, dia] = fechaISO.split("-").map(Number);
  const fecha = new Date(anio, mes - 1, dia + dias);
  return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, "0")}-${String(
    fecha.getDate(),
  ).padStart(2, "0")}`;
}

function formatearCorto(fechaISO) {
  const [, mes, dia] = fechaISO.split("-");
  return `${dia}/${mes}`;
}

function estadoCelda(fechaISO, fechaHoy, tieneRegistro) {
  if (tieneRegistro) return "dada";
  if (fechaISO > fechaHoy) return "futura";
  if (fechaISO === fechaHoy) return "hoy";
  return "vencida";
}

const estiloEstado = {
  dada: "bg-emerald-500",
  vencida: "bg-red-200",
  hoy: "bg-amber-200 ring-2 ring-amber-400",
  futura: "bg-slate-100",
};

function CalendarioMedicina({ medicina, fechaHoy }) {
  const [abierto, setAbierto] = useState(false);
  const duracion = Number(medicina.duracion);
  const dias = Array.from({ length: duracion }, (_, i) =>
    sumarDias(medicina.fechaInicio, i),
  );

  const tieneDosis = (fechaISO, tipoDosis) =>
    medicina.fechasCompletado.some(
      (dosis) => dosis.fecha === fechaISO && dosis.dosis === tipoDosis,
    );

  const totalDosisEsperadas =
    medicina.frecuencia === "12h" ? duracion * 2 : duracion;
  const totalDosisDadas = medicina.fechasCompletado.length;

  return (
    <div className="space-y-2">
      <button
        onClick={() => setAbierto((prev) => !prev)}
        className="flex w-full items-center justify-between text-sm font-medium text-slate-600 hover:text-slate-800"
      >
        <span>
          Historial · {totalDosisDadas}/{totalDosisEsperadas} dosis
        </span>
        <span className="text-slate-400">{abierto ? "▲" : "▼"}</span>
      </button>

      {abierto && (
        <div className="space-y-2 rounded-lg bg-slate-50 p-3">
          <div className="flex flex-wrap gap-1.5">
            {dias.map((fechaISO, index) => {
              if (medicina.frecuencia === "12h") {
                const estadoAM = estadoCelda(
                  fechaISO,
                  fechaHoy,
                  tieneDosis(fechaISO, "dosis1"),
                );
                const estadoPM = estadoCelda(
                  fechaISO,
                  fechaHoy,
                  tieneDosis(fechaISO, "dosis2"),
                );

                return (
                  <div
                    key={fechaISO}
                    className="flex flex-col items-center gap-1"
                    title={`Día ${index + 1} · ${formatearCorto(fechaISO)}`}
                  >
                    <div className="flex gap-0.5">
                      <span
                        className={`h-4 w-4 rounded-sm ${estiloEstado[estadoAM]}`}
                      />
                      <span
                        className={`h-4 w-4 rounded-sm ${estiloEstado[estadoPM]}`}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {index + 1}
                    </span>
                  </div>
                );
              }

              const estado = estadoCelda(
                fechaISO,
                fechaHoy,
                tieneDosis(fechaISO, "dosis1"),
              );

              return (
                <div
                  key={fechaISO}
                  className="flex flex-col items-center gap-1"
                  title={`Día ${index + 1} · ${formatearCorto(fechaISO)}`}
                >
                  <span
                    className={`h-4 w-4 rounded-sm ${estiloEstado[estado]}`}
                  />
                  <span className="text-[10px] text-slate-400">
                    {index + 1}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-3 pt-1 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <span className="h-3 w-3 rounded-sm bg-emerald-500" /> Dada
            </span>
            <span className="flex items-center gap-1">
              <span className="h-3 w-3 rounded-sm bg-amber-200 ring-2 ring-amber-400" />{" "}
              Hoy
            </span>
            <span className="flex items-center gap-1">
              <span className="h-3 w-3 rounded-sm bg-red-200" /> Vencida
            </span>
            <span className="flex items-center gap-1">
              <span className="h-3 w-3 rounded-sm bg-slate-100" /> Futura
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default CalendarioMedicina;
