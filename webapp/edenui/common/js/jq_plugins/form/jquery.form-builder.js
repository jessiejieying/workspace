
//参考bootstrap form-bulider

(function($) {
$.fn.loadForm = function( defaults ) {
  var settings = $.extend({
        formInputs: [],
        buttons: []
        }, defaults ),

    addNameAndID = function( formElement ) {

      formElement= $.extend({
        type:''
      },formElement);
        if ( formElement.type === 'radio' ) {
            var nameExists = doesKeyExist( formElement.attr.radios[0], 'name'),
                IDexists =  doesKeyExist( formElement.attr.radios[0], 'id'),
                radioName = 'radio' + getRandomNumber();
            if (!nameExists) {

                  for(var i= 0,max=formElement.attr.length;i<max;i++){
                    var radio=formElement.attr[i];
                    radio.name = radioName;
                  }

            }

            else if (!IDexists) {

                  for(var i= 0,max=formElement.attr.length;i<max;i++){
                    var radio=formElement.attr[i];
                    var newID = 'radio' + getRandomNumber();

                    radio.id = newID;

                  }

            }   

        return formElement.attr;

        }

        else {
            var nameExists = doesKeyExist( formElement.attr, 'name'),
                IDexists = doesKeyExist( formElement.attr, 'id' );

            if (!nameExists && !IDexists) {

                var newNameAndID = formElement.type + getRandomNumber();

                //assigning a random name to each element if a name is not given
                formElement.attr.name = newNameAndID;
                formElement.attr.id = newNameAndID;

            }

            else if (!nameExists) {

                formElement.attr.name = formElement.attr.id;
            }

            else if (!IDexists) {

                formElement.attr.id = formElement.attr.name;
            }

        }

        return formElement.attr;

    },

    getRandomNumber = function() {

        return Math.floor( Math.random() * 99 );

    },

    compileHTMLinsert = function() {
        var HTMLinsert = "";
        var formInputsLenght=settings.formInputs.length,
            lastForm=settings.formInputs[formInputsLenght-1];
      //解决ie8数组末尾逗号引起的bug
          if(lastForm=="undefined"||lastForm==""||lastForm==undefined){
            settings.formInputs.splice((formInputsLenght-1),1);
          }
          for (var i = 0, max = settings.formInputs.length; i < max; i++) {
            var formElement=settings.formInputs[i],
                index = i,
                 adjustedFormElement = addNameAndID(formElement);
          switch (formElement.type) {

            case 'radio':
              HTMLinsert += getRadioButtons(adjustedFormElement);
              break;

            case 'select':
              HTMLinsert += getSelect(adjustedFormElement, 'select');
              break;

            case 'multiple':
              HTMLinsert += getMoreSelect(adjustedFormElement);
              break;

            case 'selectMore':
              HTMLinsert += getMoreTimeSelect(adjustedFormElement,'select');
              break;
            case 'checkbox':
              HTMLinsert += getCheckBoxes(adjustedFormElement);
              break;

            case 'file':
              HTMLinsert += getFileInput(adjustedFormElement);
              break;

            case 'textarea':
              HTMLinsert += getTextArea(adjustedFormElement);
              break;

            case 'date':
              HTMLinsert += getDate(adjustedFormElement,formElement.type);
              break;
            case 'textAdd':
              HTMLinsert += getTextInputAdd(adjustedFormElement, formElement.type);
              break;
            case 'textareaInput':
              HTMLinsert += getTextareaInput(adjustedFormElement, formElement.type);
              break;
            default:
              HTMLinsert += getTextInput(adjustedFormElement, formElement.type);
          }
        }

        return HTMLinsert;

    },

    getButtons = function( buttonAttr ) {

        var buttonHTML = '<div class="form-group form-group-footer x12 text-center">',
            endTag = "</div>";
        for(var i= 0,max=buttonAttr.length;i<max;i++){
            var button= $.extend(
                {
                  type:''
                },buttonAttr[i]
            );

          //button按钮
          if(button.type==="button"){

            var validationState = ( doesKeyExist( button, 'validationState' ) ) ? button.validationState : 'success',

                buttonID = ( doesKeyExist( button, 'id') ) ? button.id : 'button' + getRandomNumber();
                buttonText = ( doesKeyExist( button, 'infor' ) ) ? button.infor : 'Submit';
    
            buttonHTML += '<div id="' + buttonID + '"class="button common-skin-btn-syle01 button-' + ( button.size || 'lg' ) + '">' + buttonText + '</div>';

            if (button.onSubmit) {

              (function(button){

                $(document).on('click', '#' + buttonID,function(e) {

                  e.preventDefault();

                  var form=$(this).closest('form');

                  var index = parent.layer.getFrameIndex(window.name);
                  if(pintuerFormCheck("#"+buttonID)){

                    //关闭自身弹出层
                    button.onSubmit(form);

                  }

                });

              })(button);

            }

          }

          //checkbox
          else if(button.type==="checkbox"){
            buttonHTML +='<label ><input id="'+button.id+'" name="'+button.name+'" type="checkbox">'+button.infor+'</label>'

          }

        }

        return buttonHTML + endTag;

    },

    getPlaceHolder = function( attr ) {

        return ( doesKeyExist( attr, 'placeholder' ) ) ?attr.placeholder : '';

    },


    //是否存在key值
    doesKeyExist = function( object, key ){
      for(var i in object){
          if(i.indexOf(key)!==-1){
            return 1;
          }
      }
      return -1;

    },
        //获取输入信息
        getInfor=function(attr){

          return ( doesKeyExist( attr, 'infor' ) ) ?attr.infor: '';

        },

        getVal=function(attr){
          return ( doesKeyExist( attr, 'value' ) ) ?attr.value:'';
        },

        //获取验证信息
        getValidate=function(attr){
        	
          return ( doesKeyExist( attr, 'validate' ) ) ?attr.validate:'';
        },

        isRequired=function(attr){

          return ( doesKeyExist( attr, 'isRequired' ) ) ?attr.isRequired: '';

        },

        getGroupStyle=function(attr){

          return ( doesKeyExist( attr, 'style' ) ) ?attr.style: '';

        },
        getDisabled=function(attr){
          return (attr.disabled) ?'disabled="disabled"':'';
        },


        getTextInputAdd=function(attr, type){
          attr = attr || {};
          var formGroup = '<div class="form-group margin-large-top '+getGroupStyle(attr)+'">',
              field='<div class="field">',
              label='<label class="field-left text-right">',
              labelLast=getInfor(attr),
              require=(isRequired(attr))?'<i class="" style="color: red;">*</i></label>':'</label>',            
              div='<div class="field-right js-text-input-box">',
             // add='<div class="js-add-input"><i class="icon-plus js-plus float-left " onclick="addValue(this)"></i><i class="icon-minus js-minu float-left " onclick="redValue(this)"></i>',
              add='',
              //textInput=createValues( attr),
              textInput=createInputVal(attr),
              endTag ='</div></div></div>',
          completedElement =formGroup +field+label+labelLast+require+div+add+textInput +endTag;

          return completedElement;
        },

        getTextareaInput=function( attr, type ) {
          attr = attr || {};
          var btn=attr.btnRight?"<div class='btn-right'><span>选择</span></div>":"";
          var formGroup = '<div class="form-group margin-large-top '+getGroupStyle(attr)+'">',
              field='<div class="field">',
              label='<label class="field-left text-right field-left-textarea" >',
              labelLast=getInfor(attr)+'</label>',
              require=(isRequired(attr))?'<i class="float-left" style="color: red;">*</i>':'',
              div='<div class="field-right" style="position: relative;">',

              textInput = '<textarea name="' + attr.name + '" type=' + type+' class="input"' + getPlaceHolder( attr ) + 'data-validate="'+getValidate(attr)+'"'+getDisabled(attr)+'value="'+getVal(attr)+'" id="'+attr.id +'">'+getVal(attr)+'</textarea>',
              endBtn=btn,
              endTag ='</div></div></div>',
          completedElement =formGroup +field+label+labelLast+require+div+textInput +endBtn+endTag;

          return completedElement;

        },
    getTextInput = function( attr, type ) {
        attr = attr || {};
      var formGroup = '<div class="form-group margin-large-top '+getGroupStyle(attr)+'">',
            field='<div class="field">',
            label='<label class="field-left text-right">',
            labelLast=getInfor(attr),
            require=(isRequired(attr))?'<i class="" style="color: red;">*</i></label>':'</label>',

            div='<div class="field-right" style="position: relative;">',

            textInput = '<input name="' + attr.name + '" type=' + type+' class="input"' + getPlaceHolder( attr ) + 'data-validate="'+getValidate(attr)+'"'+getDisabled(attr)+'value="'+getVal(attr)+'" id="'+attr.id +'"/>',
          endTag ='</div></div></div>'
            completedElement =formGroup +field+label+labelLast+require+div+textInput +endTag;

        return completedElement;    

    },
        getDate=function( attr,type){
          attr = attr || {};
          var formGroup = '<div class="form-group margin-large-top '+getGroupStyle(attr)+'">',
              field='<div class="field">',
              label='<label class="field-left text-right" >',
              labelLast=getInfor(attr),
              require=(isRequired(attr))?'<i class="" style="color: red;">*</i></label>':'</label>',
              div='<div class="field-right">',
              textInput = '<input onfocus="'+attr.onfocus+'" name="' + attr.name + '" type=' + 'text'+' class=" input"' + getPlaceHolder( attr ) + 'data-validate="'+getValidate(attr)+'"'+getDisabled(attr)+'value="'+getVal(attr)+'" id="'+attr.id +'"/>',
              endTag ='</div></div></div>',
              completedElement =formGroup +field+label+labelLast+require+div+textInput + endTag;

          return completedElement;

        },

        getMoreTimeSelect=function( attr, type ){
          var inputType = ( type ) ? "select" : "select multiple",
              formGroup = '<div  class="form-group margin-large-top '+getGroupStyle(attr)+'" >',
              field='<div class="field">',
              label='<label class="field-left text-right" >',
              labelLast=getInfor(attr),
              require=(isRequired(attr))?'<i class="" style="color: red;">*</i></label>':'</label>',
              div='<div class="field-right"></div>',
              selectInput = '<select style="width:70px;" name="' + attr.name + '" class="input float-left"'+getDisabled(attr)+'id="'+attr.id +'">',
              options = createOptions( attr ),
              endTag = options + '</select>',
              add=createSelectDate(),
              endTagLat='</div></div>',
              completedElement =formGroup +field+label+labelLast+require+div+selectInput + endTag+add+endTagLat;

          return completedElement;

        },
    getRadioButtons = function( attr ) {
      var radioHTML='';
      var formInputsLenght=attr.radios.length,
          lastForm=attr.radios[formInputsLenght-1];
      //解决ie8数组末尾逗号引起的bug
      if(lastForm=="undefined"||lastForm==""||lastForm==undefined){
        attr.radios.splice((formInputsLenght-1),1);
      }
          for(var i= 0,max=attr.radios.length;i<max;i++){
          var   radio= $.extend(
              { checked:false },attr.radios[i]);
                checked=(radio.checked)?('checked="checked"'):'';
            radioHTML+= '<label class="margin-left"><input '+checked+' type="radio" class="input-radio" id="' + radio.id + '"   value="'+radio.value+'" name="' + radio.name + '">'+ radio.label + '</label>';
          }
          var  formGroup='<div  class="form-group margin-large-top '+getGroupStyle(attr)+'">',
              field='<div class="field">',
              label='<label class="field-left text-right">',
              labelLast=getInfor(attr),
              require=(isRequired(attr))?'<i class="" style="color: red;">*</i></label>':'</label>',
              div='<div class="field-right filed-right-radio">',
              endTag = '</div></div></div>',
          completedElement=formGroup+field+label+labelLast+require+div+radioHTML + endTag;
        return completedElement;

    },

    getCheckBoxes = function( attr ) {

        var checkHTML ='';

          for(var i= 0,max=attr.checkboxes.length;i<max;i++){

            var checkbox=attr.checkboxes[i];

            checkHTML+= '<label><input name="' + checkbox.name + '" type="checkbox" id="' + checkbox.id + '" name="' + checkbox.name + '">'+ checkbox.label + '</label>';
          }

      var  formGroup='<div class="form-group margin-large-top  '+getGroupStyle(attr)+'">',
          field='<div class="field">',
          label='<label class="field-left text-right">'+getInfor(attr)+'</label>',
          div='<div class="field-right">',
          endTag = '</div></div></div>',
          completedElement=formGroup+field+label+div+checkHTML +endTag;
      return completedElement;

    },

        createSelectDate=function(){
          var HTMLSelect='';
          HTMLSelect+='<div class="js-select-interval js-select"><select class="input float-left margin-left" name="interval_time_pre" style="width: 56px;">';
          HTMLSelect+=createOptionsDate(60);
          HTMLSelect+='</select><select class="input float-left margin-left" style="width: 56px;" name="interval_time"><option value="1">秒</option><option value="2">分</option><option value="3">时</option></select></div>';
          HTMLSelect+='<div class="js-select-day fn-hide js-select"><select class="input float-left margin-left" name="day_hour" style="width: 56px;">';
          HTMLSelect+=createOptionsDate(24);
          HTMLSelect+='</select><label class="float-left pos-rel margin-left" style="top: 7px;">时</label>';
          HTMLSelect+='<select class="input float-left margin-left" name="day_minute" style="width: 56px;">';
          HTMLSelect+=createOptionsDate(60);
          HTMLSelect+='</select><label class="float-left pos-rel margin-left" style="top: 7px;">分</label>'
          HTMLSelect+='</div>';
          HTMLSelect+='<div class="js-select-week fn-hide js-select"><select class="input float-left margin-left" name="week_date" style="width: 80px;">';
          HTMLSelect+=createSelectWeek();
          HTMLSelect+='</select>';
          HTMLSelect+='<select class="input float-left margin-left" name="week_hour" style="width: 56px;">';
          HTMLSelect+=createOptionsDate(24);
          HTMLSelect+='</select><label class="float-left pos-rel margin-left" style="top: 7px;">时</label>';
          HTMLSelect+='<select class="input float-left margin-left" name="week_minute" style="width: 56px;">';
          HTMLSelect+=createOptionsDate(60);
          HTMLSelect+='</select><label class="float-left pos-rel margin-left" style="top: 7px;">分</label></div>';
          HTMLSelect+='<div class="js-select-month fn-hide js-select"><select class="input float-left margin-left" name="month_date" style="width: 56px;">';
          HTMLSelect+=createSelectMonth(31);
          HTMLSelect+='</select><label class="float-left pos-rel margin-left" style="top: 7px;">号</label>';
          HTMLSelect+='<select class="input float-left margin-left" name="month_hour" style="width: 56px;">';
          HTMLSelect+=createOptionsDate(24);
          HTMLSelect+='</select><label class="float-left margin-left pos-rel" style="top: 7px;">时</label>';
          HTMLSelect+='<select class="input float-left margin-left" name="month_minute" style="width: 56px;">';
          HTMLSelect+=createOptionsDate(60);
          HTMLSelect+='</select><label class="float-left pos-rel margin-left" style="top: 7px;">分</label></div>';
          return HTMLSelect;

        },

        changeWeek=function(i){
          var week="星期";
          if(i===0){
            return week+"天";
          }
          else if(i===1){
            return week+"一";
          }
          else if(i===2){
            return week+"二";
          }
          else if(i===3){
            return week+"三";
          }
          else if(i===4){
            return week+"四";
          }
          else if(i===5){
            return week+"五";
          }
          else if(i===6){
            return week+"六";
          }

        },
        createSelectWeek=function(){

            var options='';
            for(var i=1;i<8;i++){
              var val=i;
              if(i===7){
                val=0;
              }
              options+='<option value="'+val+'">'+changeWeek(val)+'</option>';
            }
          return options;
        },
        createSelectMonth=function(num){
          var options='';
          for(var i= 0,max=num;i<max;i++){
            options+='<option value="'+(i+1)+'">'+(i+1)+'</option>';
          }
          return options;
        },
        createOptionsDate=function(num){
          var options='';
          for(var i= 0,max=num;i<max;i++){
            options+='<option value="'+i+'">'+i+'</option>';
          }
          return options;

        },
    createOptions = function( attr ) {

        var HTMLoptions = '';

          for(var i= 0,max=attr.options.length;i<max;i++){
            var config={"value":"","text":"","selected":false}
            var option=attr.options[i];
            option= $.extend(config,option);
            if(option.selected){
              HTMLoptions+= '<option selected="'+option.selected+'" value="'+option.value+'">' +  option.text +'</option>';
            }
         else{
              HTMLoptions+= '<option value="'+option.value+'" >' +  option.text +'</option>';
            }

        }

        return HTMLoptions;

    },

        createValues=function( attr ){
          var HTMLoptions = '';
          for(var i= 0,max=attr.content.length;i<max;i++){
            var content=attr.content[i];
              HTMLoptions+='<input class="input" name="'+content.name+'" data-validate="'+getValidate(attr)+'" type="text" value="'+content.value+'" />';
          }

          return HTMLoptions;

        },
        createInputVal=function(attr){       
        	  var HTMLoptions = '';
              for(var i= 0,max=attr.content.length;i<max;i++){
                var content=attr.content[i];
                var reduce=(i>0)?'<i class="icon-minus js-minu float-left " onclick="redValue(this)"></i>':'';
                
                  HTMLoptions+='<div class="js-add-input"><i class="icon-plus js-plus float-left " onclick="addValue(this)" ></i>'+reduce+'<input class="input" name="'+content.name+'" data-validate="'+getValidate(attr)+'" type="text" value="'+content.value+'" /></div>';
              }

              return HTMLoptions;
        },
    getSelect = function( attr, type ) {

        var inputType = ( type ) ? "select" : "select multiple",
            formGroup = '<div  class="form-group margin-large-top '+getGroupStyle(attr)+'" >',
            field='<div class="field">',
            label='<label class="field-left text-right" >',
            labelLast=getInfor(attr),
            require=(isRequired(attr))?'<i class="" style="color: red;">*</i></label>':'</label>',
            div='<div class="field-right">',
            selectInput = '<select  name="' + attr.name + '" class="input"'+getDisabled(attr)+'id="'+attr.id +'">',
            options = createOptions( attr ),
            endTag = options + '</select></div></div></div>',
            completedElement = formGroup +field+label+labelLast+require+div+selectInput + endTag;

        return completedElement;

    },
        getMoreSelect=function( attr, type ) {

          var inputType = ( type ) ? "select" : "select multiple",
              formGroup = '<div  class="form-group margin-large-top '+getGroupStyle(attr)+'" >',
              field='<div class="field">',
              label='<label class="field-left text-right" >',
              labelLast=getInfor(attr),
              require=(isRequired(attr))?'<i class="" style="color: red;">*</i></label>':'</label>',
              div='<div class="field-right">',
              selectInput = '<select multiple="multiple" style="height:80px;" name="' + attr.name + '" class="input"'+getDisabled(attr)+'id="'+attr.id +'">',
              options = createOptions( attr ),
              endTag = options + '</select></div></div></div>',
              completedElement = formGroup +field+label+labelLast+require+div+selectInput + endTag;

          return completedElement;

        },

    getFileInput = function( attr ) {

        var  formGroup = '<div class="form-group margin-large-top '+getGroupStyle(attr)+'" >',
            field='<div class="field">',
            label='<label class="field-left text-right">'+getInfor(attr)+'</label>',
            div='<div class="field-right">',
            fileInputHeader='<div class="x12"><div class="line"><a class="button input-file float-left" href="javascript:void(0);">+选择附件<input size="100" type="file" id="'+attr.id+'" /></a><div class="button margin-big-left float-left" id="'+attr.idUpload+'" onclick="">开始上传</div></div></div>',
            fileInput = '<div  class="js-choice-file"><label class="button margin-large-top">ad.png</label></div>',
            endTag ='</div></div></div>',
            completedElement =formGroup+field+label+ div+fileInputHeader+fileInput + endTag;

        return completedElement;    

    },

    getTextArea = function( attr ) {
        var formGroup = '<div class="form-group margin-large-top '+getGroupStyle(attr)+'">',
            field='<div class="field">',
            label='<label class="field-left text-right field-left-textarea">'+getInfor(attr)+'</label>',
            div='<div class="field-right">',
            rows = ( doesKeyExist( attr, 'rows') ) ? attr.rows : '3',
            textInput = '<textarea  name="' + attr.name + '"class="input"' + getPlaceHolder( attr ) + '"  id="' + attr.id + '" rows="' + rows + '">',
            value=attr.value,
            endTag = '</textarea></div></div></div>',
            completedElement =formGroup +field+label+div+textInput + value+endTag;

        return completedElement;

    };

    return this.each( function() {

        var $this = $(this),
            HTMLstart ='<form role="form" class="line oa-form-line">',
            HTMLend = '</form>',
            buttons = getButtons( settings.buttons );
            HTMLinsert =compileHTMLinsert()+buttons;
        $this.append( HTMLstart + HTMLinsert + HTMLend);
        formInit();

    });

};

})(jQuery);

function addValue(obj){
  var $this=$(obj),
      field=$this.closest(".form-group").find(".field-right");
  var validate=$(obj).closest(".js-add-input").find("input").data("validate");
  field.append('<div class="js-add-input"><i class="icon-plus js-plus float-left " onclick="addValue(this)" ></i><i class="icon-minus js-minu float-left " onclick="redValue(this)"></i><input class="input" data-validate="'+validate+'" type="text" value=""></div>');
  var $fieldRight=$this.closest(".field-right");
  
}

function redValue(obj){
  var $this=$(obj),
      $inputBox=$this.closest(".js-text-input-box"),
      field=$this.closest(".form-group").find(".field-right");
       $this.closest(".js-add-input").remove();
       var $fieldRight=$inputBox.find(".js-add-input").last(); 
}


function formInit(){
  $(".x6").each(function(i){
    var $this=$(this);
    if(i%2===1){
      $this.addClass("form-group-right");
    }
  });
}