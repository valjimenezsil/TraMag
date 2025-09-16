using Microsoft.AspNetCore.Mvc;
using TraMag.Server.Class;
using TraMag.Server.Models;

namespace TraMag.Server.Controllers;
[ApiController]
[Route("Revision")]

public class RevisionController : Controller
{
    #region "Log"
    private readonly ILogger<RevisionController> _logger;

    public RevisionController(ILogger<RevisionController> logger)
    {
        _logger = logger;
    }
    #endregion

    [HttpGet]
    [Route("GetTraMagRev")]
    public async Task<IActionResult> GetTraMagRev(string empresa, string sede, string servicio)
    {
        try
        {
            var result = await Servicios.GetTraMagRev(empresa, sede, servicio);

            if (result.status != "200")
            {
                return StatusCode(StatusCodes.Status401Unauthorized, new
                {
                    status = 401,
                    message = "No se pudo obtener las órdenes para revisar de WsTraza",
                    response = result.response
                });
            }
            return StatusCode(StatusCodes.Status200OK, new
            {
                status = 200,
                message = "Órdenes para revisar obtenidas con éxito",
                response = result.response
            });
        }
        catch (Exception ex)
        {
            var msg = Auxiliar.MensajeError(ex).Replace("'", "");
            Auxiliar msgerror = new Auxiliar();
            _logger.LogError("Se ha presentado un error en la consulta de ordenes a revisar: {error}", msg);

            return StatusCode(500, new
            {
                status = 500,
                message = msg,
                response = ""
            });
        }
    }

}

