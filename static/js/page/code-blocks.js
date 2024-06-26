import $ from 'jquery';

// Ensure preferred DSL is valid, defaulting to Kotlin DSL
const gradleKey = "preferred-gradle-dsl";
const osKey = "preferred-os";
const versionKey = "preferred-version";


///the order is used for presentation
const allOsNames = [
  "macos",
  "linux",
  "windows"
];

///the order is used for presentation
const allGradleNames = [
  "kotlin",
  "groovy",
  "gradle",
  "maven",
  "cli",
];

const allKotlinVersions = [
  "kotlin-1-6",
  "kotlin-1-5"
]

const sortAsListedToSet = (fullList, names) => {
  const result = [];
  fullList.forEach(name => {
    if (name === '') {
      return;
    }

    if(names.indexOf(name) === -1) {
      console.log("Unknown language " + name + " for " + JSON.stringify(fullList) + " will be ignored");
      return;
    }

    if (result.indexOf(name) === -1) {
      result.push(name);
    }
  });
  return result;
};

const loadInitialState = () => {
  function initPreferredBuildScriptLanguage() {
    let lang = window.localStorage.getItem(gradleKey) || 'nan';
    if (allGradleNames.indexOf(lang) === -1) {
      lang = "kotlin";
    }
    return lang;
  }

  function initPreferredOSLanguage() {
    let osName = window.localStorage.getItem(osKey) || 'nan';
    if (allOsNames.indexOf(osName) === -1) {
      osName = "macos";
      const appVersion = (navigator || {}).appVersion || '';
      if (appVersion.indexOf("Win") !== -1) osName = "windows";
      if (appVersion.indexOf("Mac") !== -1) osName = "macos";
      if (appVersion.indexOf("X11") !== -1) osName = "linux";
      if (appVersion.indexOf("Linux") !== -1) osName = "linux";
    }
    return osName;
  }

  function initPreferredVersion() {
    let version = window.localStorage.getItem(versionKey) || 'nan';
    if (allKotlinVersions.indexOf(version) === -1) {
      version = allKotlinVersions[0];
    }
    return version;
  }

  return {
    gradleValue: initPreferredBuildScriptLanguage(),
    osValue: initPreferredOSLanguage(),
    versionValue: initPreferredVersion(),
  };
};

const saveState = ({osValue = '', gradleValue = '', versionValue = ''} = {}) => {
  if (osValue !== '') window.localStorage.setItem(osKey, osValue);
  if (gradleValue !== '') window.localStorage.setItem(gradleKey, gradleValue);
  if (versionValue !== '') window.localStorage.setItem(versionKey, versionValue);
  return loadInitialState();
};


const multiLanguageSampleClass = 'multi-language-sample';
const dataSelectedGroupId = 'data-selector-group';

const newGroup = (tabsAnchor) => {
  const r = {tabsAnchor: null, snippets: [], versionOptions: [], gradleOptions: [], osOptions: [], versionTabs: [], gradleTabs: [], osTabs: []};
  if (tabsAnchor) r.tabsAnchor = tabsAnchor;
  return r;
};

const createSnippetInfo = ($, divElement) => {
    const osValue = (divElement.getAttribute("data-os") || '').toLowerCase();
    const gradleValue = (divElement.getAttribute("data-lang") || '').toLowerCase();
    const versionValue =  (divElement.getAttribute("data-version") || '').toLowerCase();

    return {
      osValue,
      gradleValue,
      versionValue,
      updateSelected : state => {
          const selectedOs = osValue === '' || osValue === state.osValue;
          const selectedGradle = gradleValue === '' || gradleValue === state.gradleValue;
          const selectedVersion = versionValue === '' || versionValue === state.versionValue;

          if (selectedOs && selectedGradle && selectedVersion) {
            divElement.classList.remove("hide")
          } else {
            divElement.classList.add("hide")
          }
        }
    };
};

const locateCodeElements = ($) => {
  const selectorGroups = {};
  [].slice.call(document.querySelectorAll("." + multiLanguageSampleClass)).forEach((divElement, index) => {
    const prevSibling = divElement.previousElementSibling;
    let groupId;

    if (prevSibling !== null && prevSibling.classList.contains(multiLanguageSampleClass)) {
       groupId = prevSibling.getAttribute(dataSelectedGroupId);
    } else {
       groupId = "snippet-" + index;
    }

    divElement.setAttribute(dataSelectedGroupId, groupId);

    const groupMembers = (selectorGroups[groupId] || newGroup(divElement) );
    selectorGroups[groupId] = groupMembers;

    const info = createSnippetInfo($, divElement);

    const  {osValue, gradleValue, versionValue} = info;
    groupMembers.osOptions.push(osValue);
    groupMembers.gradleOptions.push(gradleValue);
    groupMembers.versionOptions.push(versionValue);
    groupMembers.snippets.push(info);
  });

  [].slice.call(
      document.querySelectorAll(
          ".multi-language-span[data-os], .multi-language-span[data-lang], .multi-language-span[data-version]"
      )
  ).forEach((divElement, index) => {
    const groupMembers = newGroup();
    selectorGroups["span-" + index] = groupMembers;

    const info = createSnippetInfo($, divElement);
    groupMembers.snippets.push(info);
  });

  return selectorGroups;
};


const generateTabs = ($, selectorGroups, updateState) => {
   //generate tabs section
  for (const groupKey in selectorGroups) {
    if (!selectorGroups.hasOwnProperty(groupKey)) continue;
    const group = selectorGroups[groupKey];

    //in-line code snippets do not have tabs
    const firstCodeBlockNode = group.tabsAnchor;
    if (!firstCodeBlockNode) continue;

    const languageSelectorFragment = document.createDocumentFragment();
    const multiLanguageSelectorElement = document.createElement("div");
    multiLanguageSelectorElement.classList.add("multi-language-selector");
    languageSelectorFragment.appendChild(multiLanguageSelectorElement);

    // for "data-lang"
    sortAsListedToSet(allGradleNames, group.gradleOptions).forEach(opt => {
      const optionEl = document.createElement("code");
      optionEl.setAttribute("data-lang", opt);
      optionEl.setAttribute("role", "button");

      optionEl.classList.add("language-option");
      optionEl.innerText = opt.charAt(0).toUpperCase() + opt.slice(1);

      group.gradleTabs.push({
        updateSelected: state => {
          if (state.gradleValue === opt) {
            optionEl.classList.add("selected");
          } else {
            optionEl.classList.remove("selected");
          }
        }
      });

      optionEl.addEventListener("click", () => {
        updateState({gradleValue: opt})
      });

      multiLanguageSelectorElement.appendChild(optionEl);
    });

    // for "data-os"
    sortAsListedToSet(allOsNames, group.osOptions).reverse().forEach(opt => {
      const optionEl = document.createElement("code");
      optionEl.setAttribute("data-os", opt);
      optionEl.setAttribute("role", "button");

      optionEl.classList.add("os-option");
      optionEl.innerText = " ";

      group.osTabs.push({
        updateSelected: state => {
          if (state.osValue === opt) {
            optionEl.classList.add("selected");
          } else {
            optionEl.classList.remove("selected");
          }
        }
      });

      optionEl.addEventListener("click", () => {
        updateState({osValue: opt})
      });

      multiLanguageSelectorElement.appendChild(optionEl);
    });

    // for "data-version"
    sortAsListedToSet(allKotlinVersions, group.versionOptions).forEach(opt => {
      const optionEl = document.createElement("code");
      optionEl.setAttribute("data-version", opt);
      optionEl.setAttribute("role", "button");

      optionEl.classList.add("version-option");
      optionEl.innerText = opt.charAt(0).toUpperCase() + opt.slice(1);

      group.versionTabs.push({
        updateSelected: state => {
          if (state.versionValue === opt) {
            optionEl.classList.add("selected");
          } else {
            optionEl.classList.remove("selected");
          }
        }
      });

      optionEl.addEventListener("click", () => {
        updateState({versionValue: opt})
      });

      multiLanguageSelectorElement.appendChild(optionEl);
    });

    const clearDiv = document.createElement("div");
    clearDiv.setAttribute("clear", "both");
    languageSelectorFragment.appendChild(clearDiv);

    firstCodeBlockNode.parentNode.insertBefore(languageSelectorFragment, firstCodeBlockNode);
  }
};


$(document).ready(($) => {

  // select code sections and group neighbours to same groups
  const selectorGroups = locateCodeElements($);

  const updateState = (newStatePatch) => {
    //update local storage
    const state = saveState(newStatePatch);

    for (const groupKey in selectorGroups) {
      if (!selectorGroups.hasOwnProperty(groupKey)) continue;

      const group = selectorGroups[groupKey];

      group.snippets.forEach(snippet => {
        snippet.updateSelected(state);
      });

      group.gradleTabs.forEach(tab => {
        tab.updateSelected(state);
      });

      group.osTabs.forEach(tab => {
        tab.updateSelected(state);
      });

      group.versionTabs.forEach(tab => {
        tab.updateSelected(state);
      });
    }
  };

  generateTabs($, selectorGroups, updateState);

  updateState();

  if (!Object.keys || Object.keys(selectorGroups).length !== 0) {
    ///The page is updated white code elements are formatted or hidden,
    ///the code ensures the page is finally scrolled to the anchor/hash
    setTimeout(() => {
      const hash = window.location.hash;
      if (hash) {
        window.location.hash = hash;
      }
    }, 10);
  }
});
