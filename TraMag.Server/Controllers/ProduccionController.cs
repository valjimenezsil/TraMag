using Microsoft.AspNetCore.Mvc;
using TraMag.Server.Class;
using TraMag.Server.Models;

namespace TraMag.Server.Controllers;
[ApiController]
[Route("Produccion")]


public class ProduccionController : Controller
{
    #region "Log"
    private readonly ILogger<ProduccionController> _logger;

    public ProduccionController(ILogger<ProduccionController> logger)
    {
        _logger = logger;
    }
    #endregion

    [HttpGet]
    [Route("GetOrdenes")]
    public async Task<IActionResult> GetOrdenes(string empresa, string sede, string servicio)
    {
        try
        {
            var result = await Servicios.GetOrdenes(empresa, sede, servicio);

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
                message = "Órdenes obtenidas con éxito",
                response = result.response
            });
        }
        catch (Exception ex)
        {
            var msg = Auxiliar.MensajeError(ex).Replace("'", "");
            Auxiliar msgerror = new Auxiliar();
            _logger.LogError("Se ha presentado un error en la consulta de ordenes: {error}", msg);
            
            return StatusCode(500, new
            {
                status = 500,
                message =  msg,
                response = ""
            });
        }
    }

    [HttpGet]
    [Route("GetTraMag1")]
    public async Task<IActionResult> GetTraMag1(string empresa, string sede, string csc)
    {
        try
        {
            var result = await Servicios.GetTraMag1(empresa, sede, csc);

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
                message = "Órdenes obtenidas con éxito",
                response = result.response
            });
        }
        catch (Exception ex)
        {
            var msg = Auxiliar.MensajeError(ex).Replace("'", "");
            Auxiliar msgerror = new Auxiliar();
            _logger.LogError("Se ha presentado un error en la consulta de GetTraMag1: {error}", msg);

            return StatusCode(500, new
            {
                status = 500,
                message = msg,
                response = ""
            });
        }
    }

    [HttpPost]
    [Route("InsertTraMagPro")]
    public async Task<IActionResult> InsertTraMagPro([FromBody] InsertarProduccion payload)
    {
        try
        {
            var result = await Servicios.InsertTraMagPro(payload);
            if (result.status != "200")
            {
                return StatusCode(StatusCodes.Status401Unauthorized, new
                {
                    status = 401,
                    message = "No se pudo insertar la orden en WsTraza",
                    response = result.response
                });
            }
            return StatusCode(StatusCodes.Status200OK, new
            {
                status = 200,
                message = "Orden insertada con éxito",
                response = result.response
            });
        }
        catch (Exception ex)
        {
            var msg = Auxiliar.MensajeError(ex).Replace("'", "");
            Auxiliar msgerror = new Auxiliar();
            _logger.LogError("Se ha presentado un error en la insercion de TraMagPro: {error}", msg);

            return StatusCode(500, new
            {
                status = 500,
                message = msg,
                response = ""
            });
        }
    }

    [HttpPost]
    [Route("UpdateTraMagPro")]
    public async Task<IActionResult> UpdateTraMagPro([FromBody] InsertarProduccion payload)
    {
        try
        {
            var result = await Servicios.UpdateTraMagPro(payload);
            if (result.status != "200")
            {
                return StatusCode(StatusCodes.Status401Unauthorized, new
                {
                    status = 401,
                    message = "No se pudo actualizar la orden en WsTraza",
                    response = result.response
                });
            }
            return StatusCode(StatusCodes.Status200OK, new
            {
                status = 200,
                message = "Orden actualizada con éxito",
                response = result.response
            });
        }
        catch (Exception ex)
        {
            var msg = Auxiliar.MensajeError(ex).Replace("'", "");
            Auxiliar msgerror = new Auxiliar();
            _logger.LogError("Se ha presentado un error en la actualizacion de la orden: {error}", msg);

            return StatusCode(500, new
            {
                status = 500,
                message = msg,
                response = ""
            });
        }
    }

    [HttpPost]
    [Route("CancelTraMagPro")]
    public async Task<IActionResult> CancelTraMagPro([FromBody] CancelarProduccion payload)
    {
        try
        {
            var result = await Servicios.CancelTraMagPro(payload);
            if (result.status != "200")
            {
                return StatusCode(StatusCodes.Status401Unauthorized, new
                {
                    status = 401,
                    message = "No se pudo cancelar la orden en WsTraza",
                    response = result.response
                });
            }
            return StatusCode(StatusCodes.Status200OK, new
            {
                status = 200,
                message = "Orden cancelada con éxito",
                response = result.response
            });
        }
        catch (Exception ex)
        {
            _logger.LogError("Error al cancelar orden en WsTraza: {ex}", ex.Message);
            return StatusCode(500, new
            {
                status = 500,
                message = "Error al consumir el token desde el backend",
                response = ex.Message
            });
        }
    }

    [HttpPost]
    [Route("GetTraMag1Eti")]
    public async Task<IActionResult> GetTraMag1Eti([FromBody] List<InfoEtiqueta> payload)
    {
        try
        {
            var result = await Servicios.GetTraMag1Eti(payload);

            if (result.status != "200")
            {
                return StatusCode(StatusCodes.Status401Unauthorized, new
                {
                    status = 401,
                    message = "No se pudo obtener GetTraMag1Eti de WsTraza",
                    response = result.response
                });
            }

            return StatusCode(StatusCodes.Status200OK, new
            {
                status = 200,
                message = "GetTraMag1Eti obtenidos con éxito",
                response = result.response
            });
        }
        catch (Exception ex)
        {
            _logger.LogError("Error al obtener token WsTraza: {ex}", ex.Message);
            return StatusCode(500, new
            {
                status = 500,
                message = "Error al consumir el token desde el backend",
                response = ex.Message
            });
        }
    }

    [HttpPost]
    [Route("GetPdfEti")]
    public async Task<IActionResult> GetPdfEti([FromBody] List<InfoEtiquetaPdf> payload)
    {
        try
        {
            var (status, pdf, fileName, errorBody) = await Servicios.GetPdfEti(payload);
            if (pdf is not null && status >= 200 && status < 300)
            {
                // Mostrar inline para que el navegador lo pinte y podamos imprimir
                Response.Headers["Content-Disposition"] = $"inline; filename={fileName ?? "EtiqMagistral.pdf"}";
                return File(pdf, "application/pdf");
            }

            // Propaga estado y mensaje de error (el WS no devolvió PDF)
            return StatusCode(status == 0 ? 500 : status, new
            {
                status,
                message = "No se pudo obtener el PDF de WsTraza",
                response = errorBody
            });
        }
        catch (Exception ex)
        {
            var msg = Auxiliar.MensajeError(ex).Replace("'", "");
            Auxiliar msgerror = new Auxiliar();
            _logger.LogError("Se ha presentado un error generando el pdf de etiquetas: {error}", msg);

            return StatusCode(500, new
            {
                status = 500,
                message = msg,
                response = ""
            });
        }
    }
}
