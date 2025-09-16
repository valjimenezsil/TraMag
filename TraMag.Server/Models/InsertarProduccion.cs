namespace TraMag.Server.Models
{
    public class InsertarProduccion
    {
        // Cabecera - TraMag
        public long Csc { get; set; }
        public string Empresa { get; set; }
        public string Sede { get; set; }
        public long? Servicio { get; set; }
        public long? Ingreso { get; set; }
        public string? TipoIde { get; set; }
        public string? Ide { get; set; }
        public long? Folio { get; set; }
        public string? MSCodi { get; set; }
        public string? MSPrAc { get; set; }
        public string? CncCd { get; set; }
        public string? MSForm { get; set; }
        public string? ProcEst { get; set; }
        public string? ImpEst { get; set; }
        public string? Estado { get; set; }
        public string? UsuAdd { get; set; }
        public string? FecAdd { get; set; }
        public string? UsuMod { get; set; }
        public string? FecMod { get; set; }

        // TraMag1
        public long? CscSol { get; set; }
        public long? IdSol { get; set; }
        public string? MotDev { get; set; }
        public string? FotoSen { get; set; }
        public string? Color { get; set; }
        public string? VehRec { get; set; }
        public long? VolRec { get; set; }
        public long? ConRec { get; set; }
        public string? VehDil { get; set; }
        public long? VolDil { get; set; }
        public long? ConDil { get; set; }
        public string? Via { get; set; }
        public string? Flu { get; set; }
        public string? LeyAlm { get; set; }
        public string? LeyAdm { get; set; }
        public string? NomPac { get; set; }
        public string? Hab { get; set; }
        public decimal DosPre { get; set; }
        public long Dosis24H { get; set; }
        public string? ObsProc { get; set; }
        public string? Obs { get; set; }
    }
}
