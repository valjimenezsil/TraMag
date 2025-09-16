using Microsoft.AspNetCore.Mvc;
using TraMag.Server.Class;

namespace TraMag.Server.Controllers;

[ApiController]
[Route("TraMag")]
public class TraMagController : Controller
{
    #region "Log"
    private readonly ILogger<TraMagController> _logger;
    public TraMagController(ILogger<TraMagController> logger)
    {
        _logger = logger;
    }
    #endregion

    [HttpGet]
    [Route("GetToken")]
    public async Task<IActionResult> GetToken()
    {
        try
        {
            var result = await Servicios.TokenTraza();

            if (result.status != "200")
            {
                return StatusCode(StatusCodes.Status401Unauthorized, new
                {
                    status = 401,
                    message = "No se pudo obtener el token de WsTraza",
                    response = result.response
                });
            }

            return Ok(new
            {
                status = 200,
                message = result.message,
                token = result.response
            });
        }
        catch (Exception ex)
        {
            var msg = Auxiliar.MensajeError(ex).Replace("'", "");
            Auxiliar msgerror = new Auxiliar();
            _logger.LogError("Se ha presentado un error con el token de WsTraza: {error}", msg);

            return StatusCode(500, new
            {
                status = 500,
                message = msg,
                response = ""
            });
        }
    }

    [HttpGet]
    [Route("GetMezclas")]
    public async Task<IActionResult> GetMezclas()
    {
        try
        {
            var result = await Servicios.GetMezclas();

            if (result.status != "200")
            {
                return StatusCode(StatusCodes.Status401Unauthorized, new
                {
                    status = StatusCodes.Status401Unauthorized,
                    message = "No se pudo obtener las mezclas de WsTraza",
                    response = result.response
                });
            }

            return Ok(new
            {
                status = 200,
                message = "Mezclas obtenidas con éxito",
                response = result.response
            });
        }
        catch (Exception ex)
        {
            var message = Auxiliar.MensajeError(ex).ToString().Replace("'", "");
            _logger.LogError("Error {ex}", message);
            return StatusCode(StatusCodes.Status500InternalServerError, new
            {
                status = 500,
                message = $@"error♦Error al consultar información: ♦ Se presento un error" +
                          "Error: " + message +
                          "Acción: Consultar" +
                          "Controller:<b>ConsultarUsuario" +
                          "Favor comunicarse con el area de soporte"
            });
        }
    }

    [HttpGet]
    [Route("GetProductos")]
    public async Task<IActionResult> GetProductos()
    {
        try
        {
            var result = await Servicios.GetProductos();

            if (result.status != "200")
            {
                return StatusCode(StatusCodes.Status401Unauthorized, new
                {
                    status = StatusCodes.Status401Unauthorized,
                    message = "No se pudo obtener los Productos de WsTraza",
                    response = result.response
                });
            }

            return Ok(new
            {
                status = 200,
                message = "Productos obtenidos con éxito",
                response = result.response
            });
        }
        catch (Exception ex)
        {
            var message = Auxiliar.MensajeError(ex).ToString().Replace("'", "");
            _logger.LogError("Error {ex}", message);
            return StatusCode(StatusCodes.Status500InternalServerError, new
            {
                status = 500,
                message = $@"error♦Error al consultar información: ♦ Se presento un error" +
                          "Error: " + message +
                          "Acción: Consultar" +
                          "Controller:<b>ConsultarUsuario" +
                          "Favor comunicarse con el area de soporte"
            });
        }
    }

    [HttpGet]
    [Route("GetEmpresas")]
    public async Task<IActionResult> GetEmpresas()
    {
        try
        {
            var result = await Servicios.GetEmpresas();

            if (result.status != "200")
            {
                return StatusCode(StatusCodes.Status401Unauthorized, new
                {
                    status = StatusCodes.Status401Unauthorized,
                    message = "No se pudo obtener las empresas de WsTraza",
                    response = result.response
                });
            }

            return StatusCode(StatusCodes.Status200OK, new
            {
                status = StatusCodes.Status200OK,
                message = "Empresas obtenidas con éxito",
                response = result.response
            });
        }
        catch (Exception ex)
        {
            var message = Auxiliar.MensajeError(ex).ToString().Replace("'", "");
            _logger.LogError("Error {ex}", message);
            return StatusCode(StatusCodes.Status500InternalServerError, new
            {
                status = 500,
                message = $@"error♦Error al consultar información: ♦ Se presento un error" +
                          "Error: " + message +
                          "Acción: Consultar" +
                          "Controller:<b>ConsultarUsuario" +
                          "Favor comunicarse con el area de soporte"
            });
        }
    }

    [HttpGet]
    [Route("GetSedes")]
    public async Task<IActionResult> GetSedes([FromQuery] string empresa)
    {
        try
        {
            var result = await Servicios.GetSedes(empresa);

            if (result.status != "200")
            {
                return StatusCode(StatusCodes.Status401Unauthorized, new
                {
                    status = 401,
                    message = "No se pudo obtener las sedes de WsTraza",
                    response = result.response
                });
            }

            return StatusCode(StatusCodes.Status200OK, new
            {
                status = StatusCodes.Status200OK,
                message = "Sedes obtenidos con éxito",
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

    [HttpGet]
    [Route("GetServicios")]
    public async Task<IActionResult> GetServicios([FromQuery] string empresa, [FromQuery] string sede)
    {
        try
        {
            var result = await Servicios.GetServicios(empresa, sede);

            if (result.Status != "200")
            {
                return StatusCode(StatusCodes.Status401Unauthorized, new
                {
                    status = 401,
                    message = "No se pudo obtener los servicios de WsTraza",
                    response = result.Response
                });
            }

            return Ok(new
            {
                status = 200,
                message = "Servicios obtenidos con éxito",
                response = result.Response
            });
        }
        catch (Exception ex)
        {
            var message = Auxiliar.MensajeError(ex).ToString().Replace("'", "");
            _logger.LogError("Error {ex}", message);
            return StatusCode(StatusCodes.Status500InternalServerError, new

            {
                status = 500,
                message = "Error desde el backend " + message,
                response = ""
            });
        }
    }

    [HttpGet]
    [Route("GetServiciosExt")]
    public async Task<IActionResult> GetServiciosExt([FromQuery] string empresa, [FromQuery] string sede)
    {
        try
        {
            var result = await Servicios.GetServiciosExt(empresa, sede);

            if (result.Status != "200")
            {
                return StatusCode(StatusCodes.Status401Unauthorized, new
                {
                    status = 401,
                    message = "No se pudo obtener los servicios Ext de WsTraza",
                    response = result.Response
                });
            }

            return Ok(new
            {
                status = 200,
                message = "Servicios Ext obtenidos con éxito",
                response = result.Response
            });
        }
        catch (Exception ex)
        {
            var message = Auxiliar.MensajeError(ex).ToString().Replace("'", "");
            _logger.LogError("Error {ex}", message);
            return StatusCode(StatusCodes.Status500InternalServerError, new

            {
                status = 500,
                message = "Error desde el backend " + message,
                response = ""
            });
        }
    }

    [HttpGet]
    [Route("GetColores")]
    public async Task<IActionResult> GetColores()
    {
        try
        {
            var result = await Servicios.GetColores();

            if (result.status != "200")
            {
                return StatusCode(StatusCodes.Status401Unauthorized, new
                {
                    status = StatusCodes.Status401Unauthorized,
                    message = "No se pudo obtener las Colores de WsTraza",
                    response = result.response
                });
            }

            return StatusCode(StatusCodes.Status200OK, new
            {
                status = StatusCodes.Status200OK,
                message = "Colores obtenidos con éxito",
                response = result.response
            });
        }
        catch (Exception ex)
        {
            var message = Auxiliar.MensajeError(ex).ToString().Replace("'", "");
            _logger.LogError("Error {ex}", message);
            return StatusCode(StatusCodes.Status500InternalServerError, new
            {
                status = 500,
                message = $@"error♦Error al consultar información: ♦ Se presento un error" +
                          "Error: " + message +
                          "Acción: Consultar" +
                          "Controller:<b>ConsultarUsuario" +
                          "Favor comunicarse con el area de soporte"
            });
        }
    }

    [HttpGet]
    [Route("GetQFS")]
    public async Task<IActionResult> GetQFS()
    {
        try
        {
            var result = await Servicios.GetQFS();
            if (result.status != "200")
            {
                return StatusCode(StatusCodes.Status401Unauthorized, new
                {
                    status = StatusCodes.Status401Unauthorized,
                    message = "No se pudo obtener las QFS de WsTraza",
                    response = result.response
                });
            }
            return StatusCode(StatusCodes.Status200OK, new
            {
                status = StatusCodes.Status200OK,
                message = "QFS obtenidos con éxito",
                response = result.response
            });
        }
        catch (Exception ex)
        {
            var message = Auxiliar.MensajeError(ex).ToString().Replace("'", "");
            _logger.LogError("Error {ex}", message);
            return StatusCode(StatusCodes.Status500InternalServerError, new
            {
                status = 500,
                message = $@"error♦Error al consultar información: ♦ Se presento un error" +
                          "Error: " + message +
                          "Acción: Consultar" +
                          "Controller:<b>ConsultarUsuario" +
                          "Favor comunicarse con el area de soporte"
            });
        }
    }

    [HttpGet]
    [Route("GetTipoPreparacion")]
    public async Task<IActionResult> GetTipoPreparacion()
    {
        try
        {
            var result = await Servicios.GetTipoPreparacion();
            if (result.status != "200")
            {
                return StatusCode(StatusCodes.Status401Unauthorized, new
                {
                    status = StatusCodes.Status401Unauthorized,
                    message = "No se pudo obtener los Tipo de Preparacion de WsTraza",
                    response = result.response
                });
            }
            return StatusCode(StatusCodes.Status200OK, new
            {
                status = StatusCodes.Status200OK,
                message = "Tipo de Preparacion obtenidos con éxito",
                response = result.response
            });
        }
        catch (Exception ex)
        {
            var message = Auxiliar.MensajeError(ex).ToString().Replace("'", "");
            _logger.LogError("Error {ex}", message);
            return StatusCode(StatusCodes.Status500InternalServerError, new
            {
                status = 500,
                message = $@"error♦Error al consultar información: ♦ Se presento un error" +
                          "Error: " + message +
                          "Acción: Consultar" +
                          "Controller:<b>ConsultarUsuario" +
                          "Favor comunicarse con el area de soporte"
            });
        }
    }

    [HttpGet]
    [Route("GetEstados")]
    public async Task<IActionResult> GetEstados([FromQuery] string modCod)
    {
        try
        {
            var result = await Servicios.GetEstados(modCod);
            if (result.status != "200")
            {
                return StatusCode(StatusCodes.Status401Unauthorized, new
                {
                    status = 401,
                    message = "No se pudo obtener los estados de WsTraza",
                    response = result.response
                });
            }

            return StatusCode(StatusCodes.Status200OK, new
            {
                status = StatusCodes.Status200OK,
                message = "Estados obtenidos con éxito",
                response = result.response
            });
        }
        catch (Exception ex)
        {
            var message = Auxiliar.MensajeError(ex).ToString().Replace("'", "");
            _logger.LogError("Error {ex}", message);
            return StatusCode(StatusCodes.Status500InternalServerError, new

            {
                status = 500,
                message = "Error al consumir el token desde el backend " + message,
                response = ""
            });
        }
    }

    [HttpGet]
    [Route("GetMotDev")]
    public async Task<IActionResult> GetMotDev()
    {
        try
        {
            var result = await Servicios.GetMotDev();
            return StatusCode(StatusCodes.Status200OK, new
            {
                status = StatusCodes.Status200OK,
                message = "Motivos de devolucion obtenidos con éxito",
                response = result.response
            });
        }
        catch (Exception ex)
        {
            var message = Auxiliar.MensajeError(ex).ToString().Replace("'", "");
            _logger.LogError("Error {ex}", message);
            return StatusCode(StatusCodes.Status500InternalServerError, new
            {
                status = 500,
                message = $@"error♦Error al consultar información: ♦ Se presento un error" +
                          "Error: " + message +
                          "Acción: Consultar" +
                          "Controller:<b>ConsultarUsuario" +
                          "Favor comunicarse con el area de soporte"
            });
        }
    }
}