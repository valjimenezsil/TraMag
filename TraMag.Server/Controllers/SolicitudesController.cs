using Microsoft.AspNetCore.Mvc;
using TraMag.Server.Class;
using TraMag.Server.Models;

namespace TraMag.Server.Controllers;
[ApiController]
[Route("Solicitudes")]


public class SolicitudesController : Controller
{ 
    #region "Log"
    private readonly ILogger<SolicitudesController> _logger;

    public SolicitudesController(ILogger<SolicitudesController> logger)
    {
        _logger = logger;
    }
    #endregion

    [HttpPost]
    [Route("InsertTraMagSolExt")]
    public async Task<IActionResult> InsertTraMagSolExt([FromBody] InsertSolicitudExt payload)
    {
        try
        {
            var result = await Servicios.InsertTraMagSolExt(payload);
            if (result.status != "200")
            {
                return StatusCode(StatusCodes.Status401Unauthorized, new
                {
                    status = 401,
                    message = "No se pudo insertar la solicitud ext en WsTraza",
                    response = result.response
                });
            }
            return StatusCode(StatusCodes.Status200OK, new
            {
                status = 200,
                message = "Solicitud ext insertada con éxito",
                response = result.response
            });
        }
        catch (Exception ex)
        {
            var msg = Auxiliar.MensajeError(ex).Replace("'", "");
            Auxiliar msgerror = new Auxiliar();
            _logger.LogError("Se ha presentado un error en la insercion de InsertTraMagSolExt: {error}", msg);

            return StatusCode(500, new
            {
                status = 500,
                message = msg,
                response = ""
            });
        }
    }

    [HttpGet]
    [Route("GetOrdenesExt")]
    public async Task<IActionResult> GetOrdenesExt(string empresa, string sede, string servicio)
    {
        try
        {
            var result = await Servicios.GetOrdenesExt(empresa, sede, servicio);

            if (result.status != "200")
            {
                return StatusCode(StatusCodes.Status401Unauthorized, new
                {
                    status = 401,
                    message = "No se pudo obtener las órdenes de WsTraza",
                    response = result.response
                });
            }

            return StatusCode(StatusCodes.Status200OK, new
            {
                status = 200,
                message = "Órdenes externas obtenidas con éxito",
                response = result.response
            });
        }
        catch (Exception ex)
        {
            var msg = Auxiliar.MensajeError(ex).Replace("'", "");
            Auxiliar msgerror = new Auxiliar();
            _logger.LogError("Se ha presentado un error en la consulta de GetOrdenesExt: {error}", msg);

            return StatusCode(500, new
            {
                status = 500,
                message = msg,
                response = ""
            });
        }
    }

    [HttpPost]
    [Route("CancelSolicitudesExt")]
    public async Task<IActionResult> CancelSolicitudesExt([FromBody] CancelarSolicitudes payload)
    {
        try
        {
            var result = await Servicios.CancelSolicitudesExt(payload);
            if (result.status != "200")
            {
                return StatusCode(StatusCodes.Status401Unauthorized, new
                {
                    status = 401,
                    message = "No se pudo cancelar la solicitud ext en WsTraza",
                    response = result.response
                });
            }
            return StatusCode(StatusCodes.Status200OK, new
            {
                status = 200,
                message = "Solicitud ext cancelada con éxito",
                response = result.response
            });
        }
        catch (Exception ex)
        {

            var msg = Auxiliar.MensajeError(ex).Replace("'", "");
            Auxiliar msgerror = new Auxiliar();
            _logger.LogError("Se ha presentado un error en la cancelacion de CancelSolicitudesExt: {error}", msg);

            return StatusCode(500, new
            {
                status = 500,
                message = msg,
                response = ""
            });
        }
    }
}
