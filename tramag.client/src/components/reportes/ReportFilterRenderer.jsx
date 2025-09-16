import { useEffect, useMemo, useRef, useState } from 'react';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { ProgressSpinner } from 'primereact/progressspinner';

// Importa tus fetchers reales
import { fetchEmpresas, fetchSedes, fetchServicios } from '../../services/maestrosService';

const REMOTE_FETCHERS = {
    empresas: async () => await fetchEmpresas(),
    sedes: async ({ empresa }) => await fetchSedes(empresa),
    servicios: async ({ empresa, sede }) => await fetchServicios(empresa, sede),
};

export default function ReportFilterRenderer({ schema, values, onChange, errors }) {
    const [remoteOptions, setRemoteOptions] = useState({});  // { fieldName: options[] }
    const [loadingField, setLoadingField] = useState(null);  // fieldName en carga
    const cacheRef = useRef(new Map());                      // caché por llave dependencias

    const setVal = (name, val) => onChange({ ...values, [name]: val });

    // Utilidad para armar la "key" de caché por dependencias
    const buildCacheKey = (f) => {
        if (!f.dependsOn || f.dependsOn.length === 0) return f.name + '::root';
        const depVals = f.dependsOn.map(d => `${d}=${values?.[d] ?? ''}`).join('&');
        return `${f.name}::${depVals}`;
    };

    // Carga perezosa de un select-remote cuando lo necesite
    const loadRemoteOptions = async (f) => {
        const key = buildCacheKey(f);
        if (cacheRef.current.has(key)) {
            setRemoteOptions(prev => ({ ...prev, [f.name]: cacheRef.current.get(key) }));
            return;
        }
        // Verifica dependencias completas
        if (f.dependsOn && f.dependsOn.some(d => !values?.[d])) {
            setRemoteOptions(prev => ({ ...prev, [f.name]: [] }));
            return;
        }

        try {
            setLoadingField(f.name);
            const payload = {};
            (f.dependsOn || []).forEach(d => payload[d] = values?.[d]);
            const fetcher = REMOTE_FETCHERS[f.fetcherId];
            const opts = fetcher ? await fetcher(payload) : [];
            cacheRef.current.set(key, opts);
            setRemoteOptions(prev => ({ ...prev, [f.name]: opts }));
        } finally {
            setLoadingField(null);
        }
    };

    // Efecto: cuando cambian dependencias de un campo remoto, recarga opciones y resetea su valor
    useEffect(() => {
        schema.forEach(f => {
            if (f.type === 'select-remote') {
                if (!f.dependsOn || f.dependsOn.length === 0) {
                    // root (empresas)
                    loadRemoteOptions(f);
                } else {
                    // tiene dependencias: observa sus cambios
                    const depsReady = f.dependsOn.every(d => !!values?.[d]);
                    if (depsReady) {
                        loadRemoteOptions(f);
                    } else {
                        // limpiar opciones y valor hasta tener deps
                        setRemoteOptions(prev => ({ ...prev, [f.name]: [] }));
                        if (values?.[f.name]) setVal(f.name, null);
                    }
                }
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(values), JSON.stringify(schema)]);

    return (
        <div className="grid p-fluid gap-3">
            {schema.map((f) => {
                const invalid = !!errors?.[f.name];
                const label = (
                    <label htmlFor={f.name} className={classNames('font-medium', { 'text-red-500': invalid })}>
                        {f.label}{f.required ? ' *' : ''}
                    </label>
                );

                if (f.type === 'text') {
                    return (
                        <div key={f.name} className="col-12 md:col-6">
                            {label}
                            <InputText
                                id={f.name}
                                value={values[f.name] ?? ''}
                                onChange={(e) => setVal(f.name, e.target.value)}
                                className={classNames({ 'p-invalid': invalid })}
                            />
                            {invalid && <small className="p-error">{errors[f.name]}</small>}
                        </div>
                    );
                }

                if (f.type === 'select-remote') {
                    const depsOk = (f.dependsOn || []).every(d => !!values?.[d]);
                    const disabled = (f.dependsOn && !depsOk) || loadingField === f.name;
                    const options = remoteOptions[f.name] || [];
                    return (
                        <div key={f.name} className="col-12 md:col-6">
                            {label}
                            <div className="flex align-items-center gap-2">
                                <Dropdown
                                    id={f.name}
                                    value={values[f.name] ?? null}
                                    options={options}
                                    optionLabel={f.optionLabel || 'label'}
                                    optionValue={f.optionValue || 'value'}
                                    placeholder="Seleccione"
                                    onChange={(e) => setVal(f.name, e.value)}
                                    filter
                                    disabled={disabled}
                                    className={classNames({ 'p-invalid': invalid })}
                                />
                                {loadingField === f.name && <ProgressSpinner style={{ width: 22, height: 22 }} strokeWidth="8" />}
                            </div>
                            {invalid && <small className="p-error">{errors[f.name]}</small>}
                        </div>
                    );
                }

                if (f.type === 'date') {
                    return (
                        <div key={f.name} className="col-12 md:col-6">
                            {label}
                            <Calendar
                                id={f.name}
                                value={values[f.name] ?? null}
                                onChange={(e) => setVal(f.name, e.value)}
                                dateFormat="yy-mm-dd"
                                readOnlyInput    // evita que escriban letras
                                showIcon
                                touchUI
                                className={classNames({ 'p-invalid': invalid })}
                            />
                            {invalid && <small className="p-error">{errors[f.name]}</small>}
                        </div>
                    );
                }

                return null;
            })}
        </div>
    );
}


