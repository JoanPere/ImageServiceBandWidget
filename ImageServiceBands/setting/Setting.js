///////////////////////////////////////////////////////////////////////////
// Copyright © 2014 - 2016 Esri. All Rights Reserved.
//
// Licensed under the Apache License Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
///////////////////////////////////////////////////////////////////////////

define([
  'dojo/_base/declare',
  'jimu/BaseWidgetSetting'
],
function(declare, BaseWidgetSetting) {

  return declare([BaseWidgetSetting], {
    baseClass: 'jimu-widget-demo-setting',

    startup: function(){
      //the config object is passed in
      this.setConfig(this.config);
    },

    setConfig: function(config){
      var cbUrl = document.getElementById("cb_urlUser");
      cbUrl.checked = config.userAddUrl;
      var urlTb = document.getElementById("urlText");
      urlTb.style.visibility = "hidden";
      urlTb.value = config.urlService;
      cbUrl.onclick = function(){
        if(this.checked){
          urlTb.style.visibility = "hidden";
        }else{
          urlTb.style.visibility = "visible";
        }
      };
      document.getElementById("cb_hidelayer").checked = config.hideLayer;
    },

    getConfig: function(){
      //WAB will get config object through this method
      var userUrl = document.getElementById("cb_urlUser").checked;
      var url = document.getElementById("urlText").value;
      var hide = document.getElementById("cb_hidelayer").checked;
      return {
        userAddUrl:userUrl,
        urlService: url,
        hideLayer: hide
      }
    }
  });
});