namespace TraMag.Server.Models
{
    public class InfoRepOrdDeProd
    {
        public string? logo { get; set; }
        public string? version { get; set; }
        public string? fechVersion { get; set; }
        public string? fecha { get; set; }
        public string? servcio { get; set; }           
        public string? firmaRegente { get; set; }
        public string? firmaAprueba { get; set; }
        public string? firmaPreparado { get; set; }
        public string? firmaCondicionado { get; set; }
        public string? firmaVerificado { get; set; }
        public DatosOrdenes datosOrdenees { get; set; } = new DatosOrdenes();
    }

    public class DatosOrdenes
    {
        public List<MedicamentoItem> medicamento { get; set; } = new List<MedicamentoItem>();
    }

    public class MedicamentoItem
    {
        public string? medicamento { get; set; }
        public string? dosis { get; set; }
        public string? frecuencia { get; set; }
        public string? dosisUnidad { get; set; }
        public string? päciente { get; set; }         
        public string? habitacion { get; set; }
        public string? volumen { get; set; }
        public string? dispositivo { get; set; }
        public string? interaccion { get; set; }
        public string? observacion { get; set; }
        public string? colorC { get; set; }
        public string? colorCN { get; set; }
        public string? particulasC { get; set; }
        public string? particulasCN { get; set; }
        public string? integridadC { get; set; }
        public string? integridadCN { get; set; }
        public string? etiquetaC { get; set; }
        public string? etiquetaCN { get; set; }
    }
}
