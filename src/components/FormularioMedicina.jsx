const dias = Array.from({ length: 31 }, (_, index) => index + 1);

function FormularioMedicina({
  datosFormulario,
  setDatosFormulario,
  onSubmit,
  fechaHoy,
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(datosFormulario);
      }}
      className="space-y-4 pb-5"
    >
      <div className="space-y-1">
        <label
          htmlFor="medicina"
          className="block text-sm font-medium text-slate-600"
        >
          Nombre Medicina
        </label>
        <input
          value={datosFormulario.nombre}
          onChange={(e) =>
            setDatosFormulario((prev) => ({
              ...prev,
              nombre: e.target.value,
            }))
          }
          type="text"
          name="medicina"
          id="medicina"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-slate-500 focus:outline-none"
        />
      </div>

      <div className="space-y-1">
        <label
          htmlFor="frecuencia"
          className="block text-sm font-medium text-slate-600"
        >
          Frecuencia
        </label>
        <select
          id="frecuencia"
          name="frecuencia"
          value={datosFormulario.frecuencia}
          onChange={(e) =>
            setDatosFormulario((prev) => ({
              ...prev,
              frecuencia: e.target.value,
            }))
          }
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-slate-500 focus:outline-none"
        >
          <option value="">Seleccionar frecuencia</option>
          <option value="12h">Cada 12 horas</option>
          <option value="24h">Cada 24 horas</option>
        </select>
      </div>

      <div className="space-y-1">
        <label
          htmlFor="duracion"
          className="block text-sm font-medium text-slate-600"
        >
          Duracion del tratamiento (dias)
        </label>
        <select
          id="duracion"
          name="duracion"
          value={datosFormulario.duracion}
          onChange={(e) =>
            setDatosFormulario((prev) => ({
              ...prev,
              duracion: e.target.value,
            }))
          }
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-slate-500 focus:outline-none"
        >
          {" "}
          <option value="">Seleccionar duracion</option>
          {dias.map((dia) => (
            <option key={dia} value={dia}>
              {dia}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1">
        <label
          htmlFor="fechaInicio"
          className="block text-sm font-medium text-slate-600"
        >
          Fecha de incio del tratamiento
        </label>
        <input
          id="fechaInicio"
          name="fechaInicio"
          type="date"
          value={datosFormulario.fechaInicio}
          max={fechaHoy}
          onChange={(e) =>
            setDatosFormulario((prev) => ({
              ...prev,
              fechaInicio: e.target.value,
            }))
          }
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-slate-500 focus:outline-none"
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-lg bg-slate-800 py-2 font-medium text-white transition hover:bg-slate-700"
      >
        Registrar Medicina
      </button>
    </form>
  );
}

export default FormularioMedicina;
