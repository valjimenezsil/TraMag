namespace TraMag.Server.Models
{
    public class CancelarSolicitudes
    {
        public string Empresa { get; set; }
        public string Sede { get; set; }
        public long Servicio { get; set; }
        public string UsuMod { get; set; }
        public List<CancelarSolicitudItem> Solicitudes { get; set; } = new();
    }

    public class CancelarSolicitudItem
    {
        public long CscSol { get; set; }
        public long Id { get; set; }
    }
}

