using System.Diagnostics;

public class Auxiliar
{
    public static string MensajeError(Exception ex)
    {
        var st = new StackTrace(ex, true);
        var fr = st.GetFrame(st.FrameCount - 1);

        var nombreArchivo = Path.GetFileName(fr!.GetFileName());
        var linea = fr.GetFileLineNumber();

        return
            $"{ex.Message} <br/>Archivo: {nombreArchivo} <br/>Linea: {(linea > 0 ? linea.ToString() : "Desconocida")}";
    }
}