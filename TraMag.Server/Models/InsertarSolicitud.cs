namespace TraMag.Server.Models
{
    public class TraMagOrdExtItem
    {
        public long? CscSol { get; set; }              // lo setea el backend con el mismo CSC para todo el lote
        public long? Id { get; set; }              // lo setea el backend con el mismo CSC para todo el lote
        public string? NomServicio { get; set; }
        public string MSCodi { get; set; } = "";
        public string MSPrAc { get; set; } = "";
        public string CncCd { get; set; } = "";
        public string MSForm { get; set; } = "";

        public decimal DosisPrescrita { get; set; }     // NOT NULL
        public string? Unidad { get; set; }            // p.ej. MSUni (mg/mL)
        public decimal DosisMinPresentacion { get; set; } // p.ej. MSCdos
        public long? Cantidad { get; set; }
        public string? Obs { get; set; }
    }

    public class InsertSolicitudExt
    {
        public string Empresa { get; set; } = "";
        public string Sede { get; set; } = "";
        public long Servicio { get; set; }            // para generar el CSC una sola vez
        public string UsuAdd { get; set; } = "";
        public List<TraMagOrdExtItem> Solicitudes { get; set; } = new();
    }
}
