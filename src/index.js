import EvButton from './components/button';
import EvChart from './components/chart';
import EvCheckbox from './components/checkbox';
import EvCheckboxGroup from './components/checkbox-group';
import EvIcon from './components/icon';
import EvInput from './components/input';
import EvTextField from './components/textfield';
import EvLoginField from './components/loginfield';
import EvLoadingMask from './components/loadingmask';
import {
  NavMenu as EvNavMenu,
  ContextMenu as EvContextMenu,
  ContextMenuChildren as EvContextMenuChildren,
} from './components/menu';
import EvRadio from './components/radio';
import EvRadioGroup from './components/radio-group';
import EvSelectbox from './components/selectbox';
import EvSlider from './components/slider';
import EvTable from './components/table';
import EvTimepicker from './components/timepicker';
import EvToggle from './components/toggle';
import EvLabel from './components/label';
import { Calendar as EvCalendar, Datepicker as EvDatepicker } from './components/datepicker';
import EvWindow from './components/window';
import { tabs as EvTabs, tab as EvTabPanel } from './components/tabs';
import { TreeTable as EvTreeTable } from './components/tree';
import EvSplitter from './components/splitter';
import EvMarkdown from './components/markdown';
import EvGrid from './components/grid/grid';

const components = {
  EvButton,
  EvChart,
  EvCheckbox,
  EvCheckboxGroup,
  EvIcon,
  EvInput,
  EvTextField,
  EvLoginField,
  EvLoadingMask,
  EvNavMenu,
  EvContextMenu,
  EvContextMenuChildren,
  EvRadio,
  EvRadioGroup,
  EvSelectbox,
  EvSlider,
  EvTable,
  EvTimepicker,
  EvToggle,
  EvLabel,
  EvWindow,
  EvCalendar,
  EvDatepicker,
  EvTabs,
  EvTabPanel,
  EvTreeTable,
  EvSplitter,
  EvMarkdown,
  EvGrid,
};

const evui = {
  ...components,
};
/* eslint-disable */
const install = function (Vue) {
  if (install.installed) return;

  Object.keys(evui).forEach((key) => {
    Vue.component(key, evui[key]);
  });
};

// auto install
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

const API = {
  version: '"2.0"', // eslint-disable-line no-undef
  install,
  ...components,
};

export default API;

