namespace TraMag.Server.Models
{
    public class Alistamiento
    {
        public string prepCod { get; set; }
        public string usuAdd { get; set; }
        public List<Entradas> Entradas { get; set; } = new();
    }

    public class Entradas
    {
        public long? id { get; set; }
        public string codProd { get; set; }
        public string nombre { get; set; }
        public string lote { get; set; }
        public string fechVenc { get; set; }
        public string regInvima { get; set; }
        public long cantSol { get; set; }
    }

    public class CancelarAlistamiento
    {
        public string prepCod { get; set; }
        public string usuMod { get; set; }
        public List<ent> ent { get; set; } = new();
    }

    public class ent
    {
        public long? csc { get; set; }
        public long? id { get; set; }
    }
}
