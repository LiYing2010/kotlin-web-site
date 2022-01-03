require("jquery");
require("jquery-ui/ui/widgets/tabs");
require("jquery-ui/themes/base/base.css");
require("jquery-ui/themes/base/theme.css");
import NavTree from '../com/nav-tree/index'

$(document).ready(() => {
  new NavTree(document.querySelector('.js-side-tree-nav'));

  $(".tabs").tabs();
});
