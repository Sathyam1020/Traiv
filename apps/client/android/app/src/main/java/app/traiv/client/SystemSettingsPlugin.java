package app.traiv.client;
import android.content.Intent;
import android.provider.Settings;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
@CapacitorPlugin(name="SystemSettings")
public class SystemSettingsPlugin extends Plugin {
 @PluginMethod public void open(PluginCall call) { Intent intent = new Intent(Settings.ACTION_APP_NOTIFICATION_SETTINGS); intent.putExtra(Settings.EXTRA_APP_PACKAGE, getContext().getPackageName()); getActivity().startActivity(intent); call.resolve(); }
}
