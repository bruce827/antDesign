import dva from 'dva';
import createLoading from 'dva-loading';

const runtimeDva = window.g_plugins.mergeConfig('dva');
let app = dva({
  history: window.g_history,
  
  ...(runtimeDva.config || {}),
});

window.g_app = app;
app.use(createLoading());
(runtimeDva.plugins || []).forEach(plugin => {
  app.use(plugin);
});

app.model({ namespace: 'global', ...(require('E:/github/antDesign/src/models/global.js').default) });
app.model({ namespace: 'list', ...(require('E:/github/antDesign/src/models/list.js').default) });
app.model({ namespace: 'login', ...(require('E:/github/antDesign/src/models/login.js').default) });
app.model({ namespace: 'menu', ...(require('E:/github/antDesign/src/models/menu.js').default) });
app.model({ namespace: 'project', ...(require('E:/github/antDesign/src/models/project.js').default) });
app.model({ namespace: 'setting', ...(require('E:/github/antDesign/src/models/setting.js').default) });
app.model({ namespace: 'user', ...(require('E:/github/antDesign/src/models/user.js').default) });
