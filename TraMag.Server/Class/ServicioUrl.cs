namespace TraMag.Server.Class;

public class ServicioUrl
{
    //Prueba
    private string urlbase = "https://localhost:7246/";

    //Produccion
    //private string urlbase = "https://wstraza.ocgnlocal.co/";

    public string TokenTraza => $"{urlbase}Token/GetToken";

    public string Token { get; set; } = "https://wsturingac.ocgnlocal.co/Token/GetToken";
    public string FetchUsuario { get; set; } = "https://wsturingac.ocgnlocal.co/Usuario/SelectUsuario";
    public string FetchMenu { get; set; } = "https://wsturingac.ocgnlocal.co/Usuario/SelectUsuarioMenuSubmenu";
    public string UsuarioFactor { get; set; } = "https://wsturingac.ocgnlocal.co/Usuario/Factor";
    public string GetUsuarioSinJoin { get; set; } = "https://wsturingac.ocgnlocal.co/Usuario/SelectInfoUsuario";
    public string ObtenerImagen { get; set; } = "https://wsturingac.ocgnlocal.co/Menu/ObtenerImagen";

    #region Maestros
    public string GetMezclas => $"{urlbase}Maestros/GetMezclas";
    public string GetProductos => $"{urlbase}Maestros/GetProductos";
    public string GetEmpresas => $"{urlbase}Maestros/GetEmpresa";
    public string GetSedes => $"{urlbase}Maestros/GetSedes";
    public string GetServicios => $"{urlbase}Maestros/GetServicios";
    public string GetServiciosExt => $"{urlbase}Maestros/GetServiciosExt";
    public string GetColores => $"{urlbase}Maestros/GetColores";
    public string GetQFS => $"{urlbase}Maestros/GetQFS";
    public string GetTipoPreparacion => $"{urlbase}Maestros/GetTipoPreparacion";
    public string GetEstados => $"{urlbase}Maestros/GetEstados";
    public string GetMotDev => $"{urlbase}Maestros/GetMotDev";

    #endregion

    #region Alistamiento
    public string InsertTraMagAli => $"{urlbase}Alistamiento/InsertAlistamiento";
    public string GetTraMagAliLog => $"{urlbase}Alistamiento/GetTraMagAliLog";
    #endregion

    #region Solicitudes
    public string InsertTraMagSolExt => $"{urlbase}SolicitudesExt/InsertTraMagSolExt";
    public string GetOrdenesExt => $"{urlbase}SolicitudesExt/GetOrdenesExt";
    public string CancelSolicitudesExt => $"{urlbase}SolicitudesExt/CancelTraMagSolExt";
    #endregion

    #region Producción
    public string GetOrdenes => $"{urlbase}Produccion/GetOrdenes";
    public string GetTraMag1 => $"{urlbase}Produccion/GetTraMag1";
    public string InsertTraMagPro => $"{urlbase}Produccion/InsertTraMagPro";
    public string UpdateTraMagPro => $"{urlbase}Produccion/UpdateTraMagPro";
    public string CancelTraMagPro => $"{urlbase}Produccion/CancelTraMagPro";
    public string GetTraMag1Eti => $"{urlbase}Produccion/GetTraMag1Eti";

    //Impresión de etiquetas
    public string TokenWsFormato { get; set; } = "https://wsformatos.ocgnlocal.co/Token/GetToken";
    public string GetPdfEti { get; set; } = "https://wsformatos.ocgnlocal.co/TrazaMag/PostTagMag";

    #endregion

    #region Revisión
    public string GetTraMagRev => $"{urlbase}Revision/GetTraMagRev";

    #endregion

    #region Reportes
    public string GetOrdDeProd1 => $"{urlbase}Reportes/GetOrdDeProd1";
    public string GetOrdDeProdExt1 => $"{urlbase}Reportes/GetOrdDeProdExt1";
    public string GetInfoReporteOrdProd => $"{urlbase}Reportes/GetInfoReporteOrdProd";
    public string GetPdfOrdDeProd1 => "https://wsformatos.ocgnlocal.co/TrazaMag/PostOrdenesProduccion";
    #endregion
}