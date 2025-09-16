namespace TraMag.Server.Models
{
    public class InfoEtiqueta
    {
        public string Empresa { get; set; }
        public string Sede { get; set; }
        public long Csc { get; set; }
    }

    public class  InfoEtiquetaPdf
    {
        public string cliente { get; set; }
        public string nomMezcla { get; set; }
        public string dosisMezcla { get; set; }
        public string vehiculoDilucion { get; set; }
        public string volumen { get; set; }
        public string via { get; set; }
        public string paciente { get; set; }
        public string habitacion { get; set; }
        public string leyAlmacenamiento { get; set; }
        public string leyAdministracion { get; set; }
        public string flu { get; set; }
        public string lote { get; set; }
        public string qfPreparacion { get; set; }
        public string qfCalidad { get; set; }
        public string version { get; set; }
    }
}
