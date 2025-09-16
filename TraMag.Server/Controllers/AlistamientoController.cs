using Microsoft.AspNetCore.Mvc;
using TraMag.Server.Class;
using TraMag.Server.Models;

namespace TraMag.Server.Controllers
{
    [ApiController]
    [Route("Alistamiento")]
    public class AlistamientoController : Controller
    {
        #region "Log"
        private readonly ILogger<AlistamientoController> _logger;

        public AlistamientoController(ILogger<AlistamientoController> logger)
        {
            _logger = logger;
        }
        #endregion

        [HttpPost]
        [Route("InsertTraMagAli")]
        public async Task<IActionResult> InsertTraMagAli([FromBody] Alistamiento payload)
        {
            try
            {
                var result = await Servicios.InsertTraMagAli(payload);
                if (result.status != "200")
                {
                    return StatusCode(StatusCodes.Status401Unauthorized, new
                    {
                        status = 401,
                        message = "No se pudo insertar el alistamiento en WsTraza",
                        response = result.response
                    });
                }
                return StatusCode(StatusCodes.Status200OK, new
                {
                    status = 200,
                    message = "Alistamiento insertado con éxito",
                    response = result.response
                });
            }
            catch (Exception ex)
            {
                var msg = Auxiliar.MensajeError(ex).Replace("'", "");
                Auxiliar msgerror = new Auxiliar();
                _logger.LogError("Se ha presentado un error en la insercion de InsertTraMagAli: {error}", msg);

                return StatusCode(500, new
                {
                    status = 500,
                    message = msg,
                    response = ""
                });
            }
        }

        [HttpGet]
        [Route("GetTraMagAliLog")]
        public async Task<IActionResult> GetTraMagAliLog(string prepcod)
        {
            try
            {
                var result = await Servicios.GetTraMagAliLog(prepcod);
                if (result.status != "200")
                {
                    return StatusCode(StatusCodes.Status401Unauthorized, new
                    {
                        status = 401,
                        message = "No se pudo obtener el alistamiento del dia en WsTraza",
                        response = result.response
                    });
                }
                return StatusCode(StatusCodes.Status200OK, new
                {
                    status = 200,
                    message = "Alistamiento obtenido con éxito",
                    response = result.response
                });
            }
            catch (Exception ex)
            {
                var msg = Auxiliar.MensajeError(ex).Replace("'", "");
                Auxiliar msgerror = new Auxiliar();
                _logger.LogError("Se ha presentado un error en la busqueda del alistamiento: {error}", msg);

                return StatusCode(500, new
                {
                    status = 500,
                    message = msg,
                    response = ""
                });
            }
        }
    }
}

