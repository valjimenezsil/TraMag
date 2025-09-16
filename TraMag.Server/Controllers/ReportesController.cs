using Microsoft.AspNetCore.Mvc;
using TraMag.Server.Class;
using TraMag.Server.Models;

namespace TraMag.Server.Controllers;
[ApiController]
[Route("Reportes")]

public class ReportesController : Controller
{
    #region "Log"
    private readonly ILogger<ReportesController> _logger;

    public ReportesController(ILogger<ReportesController> logger)
    {
        _logger = logger;
    }
    #endregion

    [HttpGet]
    [Route("GetOrdDeProd1")]
    public async Task<IActionResult> GetOrdDeProd1(string empresa, string sede, string servicio, string fecha)
    {
        try
        {
            var result = await Servicios.GetOrdDeProd1(empresa, sede, servicio, fecha);

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
                message = "Órden de produccion obtenidas con éxito",
                response = result.response
            });
        }
        catch (Exception ex)
        {
            var msg = Auxiliar.MensajeError(ex).Replace("'", "");
            Auxiliar msgerror = new Auxiliar();
            _logger.LogError("Se ha presentado un error en la consulta de GetOrdDeProd1: {error}", msg);

            return StatusCode(500, new
            {
                status = 500,
                message = msg,
                response = ""
            });
        }
    }

    [HttpGet]
    [Route("GetOrdDeProdExt1")]
    public async Task<IActionResult> GetOrdDeProdExt1(string empresa, string sede, string servicio, string fecha)
    {
        try
        {
            var result = await Servicios.GetOrdDeProdExt1(empresa, sede, servicio, fecha);

            if (result.status != "200")
            {
                return StatusCode(StatusCodes.Status401Unauthorized, new
                {
                    status = 401,
                    message = "No se pudo obtener las órdenes de Produccion extde WsTraza",
                    response = result.response
                });
            }

            return StatusCode(StatusCodes.Status200OK, new
            {
                status = 200,
                message = "Órden de produccion ext obtenidas con éxito",
                response = result.response
            });
        }
        catch (Exception ex)
        {
            var msg = Auxiliar.MensajeError(ex).Replace("'", "");
            Auxiliar msgerror = new Auxiliar();
            _logger.LogError("Se ha presentado un error en la consulta de GetOrdDeProdExt1: {error}", msg);

            return StatusCode(500, new
            {
                status = 500,
                message = msg,
                response = ""
            });
        }
    }

    [HttpGet]
    [Route("GetInfoReporteOrdProd")]
    public async Task<IActionResult> GetInfoReporteOrdProd(string empresa, string sede, string servicio, string codapli, string fecha, string tipoOrden)
    {
        try
        {
            var result = await Servicios.GetInfoReporteOrdProd(empresa, sede, servicio, codapli, fecha, tipoOrden);

            if (result.status != "200")
            {
                return StatusCode(StatusCodes.Status401Unauthorized, new
                {
                    status = 401,
                    message = "No se pudo obtener la información del reporte de órdenes de producción",
                    response = result.response
                });
            }

            return StatusCode(StatusCodes.Status200OK, new
            {
                status = 200,
                message = "Información del reporte de órdenes de producción obtenida con éxito",
                response = result.response
            });
        }
        catch (Exception ex)
        {
            var msg = Auxiliar.MensajeError(ex).Replace("'", "");
            Auxiliar msgerror = new Auxiliar();
            _logger.LogError("Se ha presentado un error en la consulta de GetInfoReporteOrdProd: {error}", msg);

            return StatusCode(500, new
            {
                status = 500,
                message = msg,
                response = ""
            });
        }
    }

    [HttpPost]
    [Route("GetPdfOrdDeProd1")]
    public async Task<IActionResult> GetPdfOrdDeProd1([FromBody] List<InfoRepOrdDeProd> payload)
    {
        try
        {
            var (status, pdf, fileName, errorBody) = await Servicios.GetPdfOrdDeProd1(payload);
            if (pdf is not null && status >= 200 && status < 300)
            {
                // Mostrar inline para que el navegador lo pinte y podamos imprimir
                Response.Headers["Content-Disposition"] = $"inline; filename={fileName ?? "OrdendeProduccion.pdf"}";
                return File(pdf, "application/pdf");
            }

            // Propaga estado y mensaje de error (el WS no devolvió PDF)
            return StatusCode(status == 0 ? 500 : status, new
            {
                status,
                message = "No se pudo obtener el PDF de WsFormatos",
                response = errorBody
            });
        }
        catch (Exception ex)
        {
            var msg = Auxiliar.MensajeError(ex).Replace("'", "");
            Auxiliar msgerror = new Auxiliar();
            _logger.LogError("Se ha presentado un error generando el pdf de orden de Produccion: {error}", msg);

            return StatusCode(500, new
            {
                status = 500,
                message = msg,
                response = ""
            });
        }
    }
}
