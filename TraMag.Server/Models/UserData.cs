namespace TraMag.Server.Models;

public class SessionData
{
    public string? Token { get; set; }
    public string? Usuario { get; set; }
    public string? CodEmpresa { get; set; }
    public string? CodSede { get; set; }
    public string? Clave_temporal { get; set; }
    public string? EstadoClaveTemporal { get; set; }
    public string Email_origen { get; set; }
    public string Email_origen_password { get; set; }
    public string? Email_Aute { get; set; }
    public string? Phone_Aute { get; set; }
    public string? Time_Autenticacion { get; set; }
    public string Time_Cod_Aute { get; set; }
}

