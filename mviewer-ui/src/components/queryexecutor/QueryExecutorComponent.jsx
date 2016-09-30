import React from 'react'
import queryExecutorStyles from './queryexecutor.css'
import TreeView from '../treeview/TreeViewComponent.jsx'
import $ from 'jquery'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import update from 'react-addons-update'
import DeleteComponent from '../deletecomponent/DeleteComponent.jsx'
import NewCollection from '../newcollection/newCollectionComponent.jsx'
import NewDocument from '../newdocument/newDocumentComponent.jsx'
import CollectionStats from '../collectionstats/CollectionStatsComponent.jsx'
import Document from '../document/DocumentComponent.jsx'
import NewFile from '../newfile/NewFileComponent.jsx'
import service from '../../gateway/service.js'
import TextInput from '../TextInput/TextInputComponent.jsx'
import { Form } from 'formsy-react'
import autosize from 'autosize'

class QueryExecutorComponent extends React.Component {

  constructor(props) {
      super(props);
      this.state = {
            canSubmit: true,
            _isMounted: false,
            collectionObjects:[],
            startLabel: 0,
            endLabel: 0,
            componentMounted:false,
            componentUpdated:false ,
            selectedTab:0,
            limit: 10,
            skip: 0,
            sort:'_id:-1',
            totalCount: 0,
            data: [],
            offset: 0,
            skipValue:0,
            limitValue:10,
            fields: [],
            modalIsOpen: false,
            errorMessage: '',
            singleDocument: '',
            query: this.props.queryType == "collection" ? 'db.'+this.props.currentItem+'.find({})' :
                   'db.'+this.props.currentItem+'.files.find({})'
      }
  }

  openModal() {
    this.setState({modalIsOpen: true});
    this.setState({message: ''});
  }

  closeModal(successMessage) {
    if(this.state._isMounted == true){
      this.setState({modalIsOpen: false});
    }
    // alert('fdsfsdf');
    if (successMessage == true){
      this.props.refreshCollectionList(false);
    }

  }

  success(calledFrom, data){
    if(calledFrom == 'getAttributes'){
      var arr = data.response.result.keys;
      var newArr = [];
      for(var i=0; i < arr.length; i++) {
        newArr.push({"value": arr[i], "selected" :true});
      }
      this.setState({fields:newArr});
    }

    if(calledFrom == 'innerCall1') {
      this.setState({totalCount:data.response.result.count});
      if (this.state.skipValue < this.state.totalCount) {
        var size = this.state.skipValue + this.state.limitValue;
        this.setState({startLabel:(this.state.totalCount != 0 ? this.state.skipValue + 1 : 0)})
        this.setState({endLabel:(this.state.totalCount <= size ? this.state.totalCount : this.state.skipValue + this.state.limitValue)})
      }
    }

   if(calledFrom == 'innerCall2'){
     this.setState({totalCount:data.response.result.count});
     this.setState({totalCount:data.response.result.count});
     if (data.response.result.count < 10)
     {
       this.setState({limitValue:data.response.result.count});
       this.setState({skipValue:0});
     }
     else {
       this.setState({limitValue:this.state.limit});
       this.setState({skipValue:0});
     }
     if (this.state.skipValue < this.state.totalCount) {
       var size = this.state.skipValue + this.state.limitValue;
       this.setState({startLabel:(this.state.totalCount != 0 ? this.state.skipValue + 1 : 0)})
       this.setState({endLabel:(this.state.totalCount <= size ? this.state.totalCount : this.state.skipValue + this.state.limitValue)})
     } else {
     }
     if(data.response.result.count==0){
       this.setState({startLabel: 0});
       this.setState({endLabel: 0});
     }
     if(data.response.error) {
       that.setState({collectionObjects:[]});
     }
   }

   if(calledFrom == 'innerCall3'){
     this.setState({totalCount:data.response.result.count});
     if (this.state.skipValue < this.state.totalCount) {
       var size = this.state.skipValue + this.state.limitValue;
       this.setState({startLabel:(this.state.totalCount != 0 ? this.state.skipValue + 1 : 0)})
       this.setState({endLabel:(this.state.totalCount <= size ? this.state.totalCount : this.state.skipValue + this.state.limitValue)})
     }
   }

   if(calledFrom == 'innerCall4'){
     this.setState({totalCount:data.response.result.count});
     if (this.state.skipValue < this.state.totalCount) {
       var size = this.state.skipValue + this.state.limitValue;
       this.setState({startLabel:(this.state.totalCount != 0 ? this.state.skipValue + 1 : 0)})
       this.setState({endLabel:(this.state.totalCount <= size ? this.state.totalCount : this.state.skipValue + this.state.limitValue)})
     }
     else{
       this.setState({startLabel: 0});
       this.setState({endLabel: 0});
     }
   }
 }

  failure(){

  }

  getAttributes (currentDb,currentItem, connectionId) {
    var that = this;
    var partialUrl = currentDb+'/'+currentItem+'/document/keys?connectionId='+connectionId+'&allKeys=true';
    var newDocumentCall = service('GET', partialUrl, '');
    newDocumentCall.then(this.success.bind(this, 'getAttributes'), this.failure.bind(this, 'getAttributes'));
  }

  componentDidMount (){
    this.state._isMounted = true;
    var that = this;
    var currentDb = this.props.currentDb;
    var currentItem = this.props.currentItem;
    var connectionId = this.props.connectionId;
    var partialUrl = this.props.queryType == "collection" ? currentDb+'/'+currentItem+'/document?query='+this.state.query+'&connectionId='+connectionId+'&fields=""&limit=10&skip=0&sortBy={_id:-1}&allKeys=true' :
              currentDb+'/gridfs/'+currentItem+'/getfiles?query='+this.state.query+'&fields=""&limit=10&skip=0&sortBy={_id:-1}&connectionId='+connectionId;
    var queryExecutorCall1 = service('GET', partialUrl, '');
    queryExecutorCall1.then(this.success1.bind(this), this.failure1.bind(this));
  }

  success1(data){
    if(typeof(data.response.result) != 'undefined'){
      var array = data.response.result.documents;
      var partialUrl = this.props.currentDb+'/gridfs/'+this.props.currentItem+'/count?connectionId='+this.props.connectionId;
      var queryExecutorInnerCall1 = service('GET', partialUrl, '');
      if(this.state._isMounted == true){
      this.setState({collectionObjects:array});
      this.props.queryType == "collection" ? this.getAttributes(this.props.currentDb,this.props.currentItem, this.props.connectionId) : null;
      this.props.queryType == "fs" ?
      (queryExecutorInnerCall1.then(this.success.bind(this, 'innerCall1'), this.failure1.bind(this , 'innerCall1')))
      : this.setState({totalCount:data.response.result.count});
        if (this.state.skipValue < this.state.totalCount) {
          var size = this.state.skipValue + this.state.limitValue;
          this.setState({startLabel:(this.state.totalCount != 0 ? this.state.skipValue + 1 : 0)})
          this.setState({endLabel:(this.state.totalCount <= size ? this.state.totalCount : this.state.skipValue + this.state.limitValue)})
        };
    }
  }
  if(data.response.error) {
    this.setState({collectionObjects:[]});
  }
}


  failure1(){

  }

  success2(currentDb, currentItem, connectionId,  data){
    var partialUrl = currentDb+'/gridfs/'+currentItem+'/count?connectionId='+connectionId;
    var queryExecutorInnerCall2 = service('GET', partialUrl, '');
    if(data.response.result!=undefined && this.state._isMounted == true)
    {
      var array = data.response.result.documents;
        this.setState({collectionObjects:array});
        this.props.queryType == "collection" ? this.getAttributes(currentDb,currentItem, connectionId) : null;
        this.props.queryType == "fs" ?
        queryExecutorInnerCall2.then(this.success.bind(this , 'innerCall2'), this.failure.bind(this, 'innerCall2'))
      :
        this.setState({totalCount:data.response.result.count});
        if (data.response.result.count < 10)
        {
          this.setState({limitValue:data.response.result.count});
          this.setState({skipValue:0});
        }
        else {
          this.setState({limitValue:this.state.limit});
          this.setState({skipValue:0});
        }
        if (this.state.skipValue < this.state.totalCount) {
          var size = this.state.skipValue + this.state.limitValue;
          this.setState({startLabel:(this.state.totalCount != 0 ? this.state.skipValue + 1 : 0)})
          this.setState({endLabel:(this.state.totalCount <= size ? this.state.totalCount : this.state.skipValue + this.state.limitValue)})
        } else {
        }
        if(data.response.result.count==0){
          this.setState({startLabel: 0});
          this.setState({endLabel: 0});
        }
        if(data.response.error) {
          this.setState({collectionObjects:[]});
        }
    }
  }

  failure2(){

  }

  success3(currentDb, currentItem, connectionId, data){
    var partialUrl = currentDb+'/gridfs/'+currentItem+'/count?connectionId='+connectionId;
    var queryExecutorInnerCall3 = service('GET', partialUrl, '');
    if(data.response.result!=undefined)
    {
      var array = data.response.result.documents;
      this.setState({collectionObjects:array});
      this.props.queryType == "collection" ? this.getAttributes(currentDb,currentItem, connectionId) : null;
      this.props.queryType == "fs" ?
      queryExecutorInnerCall3.then(this.success.bind(this , 'innerCall3'), this.failure.bind(this, 'innerCall3'))
      : this.setState({totalCount:data.response.result.count});
        if (this.state.skipValue < this.state.totalCount) {
          var size = this.state.skipValue + this.state.limitValue;
          this.setState({startLabel:(this.state.totalCount != 0 ? this.state.skipValue + 1 : 0)})
          this.setState({endLabel:(this.state.totalCount <= size ? this.state.totalCount : this.state.skipValue + this.state.limitValue)})
        }
        if(data.response.result.count==0){
          this.setState({startLabel: 0});
          this.setState({endLabel: 0});
          this.setState({totalCount: 0});
        }
    }

    if(data.response.error) {
      this.setState({collectionObjects:[]});
      this.setState({errorMessage : 'There is an error with the Query, Please check the parameters'});
      setTimeout(function(){
           this.setState({errorMessage: ''});
      }.bind(this), 2000);
      this.setState({startLabel: 0});
      this.setState({endLabel: 0});
      this.setState({totalCount: 0});
    }
  }

  failure3(){

  }


  success4(currentDb, currentItem, connectionId, data){
    var partialUrl = currentDb+'/gridfs/'+currentItem+'/count?connectionId='+connectionId;
    var queryExecutorInnerCall4 = service('GET', partialUrl, '');
    if(data.response.result!=undefined)
    {
      var array = data.response.result.documents;
      this.setState({collectionObjects:array});
      this.props.queryType == "collection" ? this.getAttributes(currentDb,currentItem, connectionId) : null;
      this.props.queryType == "fs" ?
      queryExecutorInnerCall4.then(this.success.bind(this , 'innerCall4'), this.failure.bind(this, 'innerCall4'))
      : this.setState({totalCount:data.response.result.count});
        if (this.state.skipValue < this.state.totalCount) {
          var size = this.state.skipValue + this.state.limitValue;
          this.setState({startLabel:(this.state.totalCount != 0 ? this.state.skipValue + 1 : 0)})
          this.setState({endLabel:(this.state.totalCount <= size ? this.state.totalCount : this.state.skipValue + this.state.limitValue)})
        }
        else{
          this.setState({startLabel: 0});
          this.setState({endLabel: 0});
        }
        if(data.response.error) {
          this.setState({collectionObjects:[]});
        }
    }
  }

  failure4(){

  }

  componentWillUnmount(){
    this.state._isMounted = false;
  }

  componentWillReceiveProps(nextProps){
    this.setState({selectedTab:0});
    this.setState({query:this.props.queryType == "collection" ? 'db.'+this.props.currentItem+'.find({})' :
                         'db.'+this.props.currentItem+'.files.find({})'});
    this.setState({collectionObjects:[]});
    this.setState({skip:0});
    this.setState({limit:10});
    this.setState({sort:'_id:-1'});
    var currentDb = nextProps.currentDb;
    var currentItem = nextProps.currentItem;
    var connectionId = this.props.connectionId;
    var partialUrl = this.props.queryType == "collection" ? currentDb+'/'+currentItem+'/document?query=db.'+currentItem+'.find(%7B%7D)&connectionId='+connectionId+'&fields=""&limit=10&skip=0&sortBy={_id:-1}&allKeys=true' :
              currentDb+'/gridfs/'+currentItem+'/getfiles?query=db.'+currentItem+'.files.find(%7B%7D)&fields=""&limit=10&skip=0&sortBy=%7B_id%3A1%7D&connectionId='+connectionId;
    this.setState({query:nextProps.queryType == "collection" ? 'db.'+currentItem+'.find({})' : 'db.'+currentItem+'.files.find({})'});
    var queryExecutorCall2 = service('GET', partialUrl, '');
    queryExecutorCall2.then(this.success2.bind(this , currentDb, currentItem, connectionId), this.failure2.bind(this));
  }

  clickHandler(){
    var that = this;
    that.setState({limitValue:parseInt(that.state.limit)});
    that.setState({skipValue:parseInt(that.state.skip)});
    var attributes = [];
    var allSelected = true;
    var currentDb = this.props.currentDb;
    var currentItem = this.props.currentItem;
    var connectionId = this.props.connectionId;
    this.state.fields.map(function(e) {
      if(e.selected){
        attributes.push(e.value);
      } else {
        allSelected = false;
      }
    });
   var partialUrl = this.props.queryType == "collection" ? currentDb+'/'+currentItem+'/document?query=' + this.state.query + '&connectionId='+connectionId+'&fields=' + attributes +'&limit='+this.state.limit+'&skip='+this.state.skip+'&sortBy={'+this.state.sort+'}&allKeys=' + allSelected :
              currentDb+'/gridfs/'+currentItem+'/getfiles?query='+ this.state.query +'&fields=""&limit='+this.state.limit+'&skip='+this.state.skip+'&sortBy={'+this.state.sort+'}&connectionId='+connectionId;
   var queryExecutorCall3 = service('GET', partialUrl, '');
   queryExecutorCall3.then(this.success3.bind(this , currentDb, currentItem, connectionId), this.failure3.bind(this));
  }

  refresh(buttonValue){
    if( buttonValue == 'new'){
      this.clickHandler();
    }
    else{
      this.paginationHandler();
    }
    this.getAttributes(this.props.currentDb, this.props.currentItem, this.props.connectionId);
  }

  attributeHandler(r) {
    var that = this;
    var index = 0;
    var checkUncheck = function(value) {
      that.state.fields.map(function(e) {
        if(e.value == r.result.value) {
          that.setState(update(that.state.fields[index], {selected: {$set: value}}));
          ++index;
        }
      });
    }
    return function(e) {
      if(r.result.selected == true){
        r.result.selected = false;
        checkUncheck(false);
      }
      else {
        r.result.selected = true;
        checkUncheck(true);
      }
    }.bind(this);
  }

  selectAllHandler () {
    var index = 0;
    var that = this;
    return function() {
      var state = this.state.fields.map(function(d) {
        return {
          value: d.value,
          selected: true
        };
      });
      this.setState({fields:state});
    }.bind(this);
  }

  unSelectAllHandler () {
    return function() {
      var state = this.state.fields.map(function(d) {
        return {
          value: d.value,
          selected: false
        };
      });
      this.setState({fields:state});
    }.bind(this);
  }

  changeHandler(){
    return function(e) {
      this.setState({query:e.target.value});
    }.bind(this);
  }

  skipHandler(){
    return function(e) {
      this.setState({skip:e.target.value});
    }.bind(this);
  }

  limitHandler(){
    return function(e) {
      this.setState({limit:e.target.value});
    }.bind(this);
  }

  sortHandler(){
    return function(e) {
      this.setState({sort:e.target.value});
    }.bind(this);
  }

  hand(){

  }

  paginationHandler(e){
    var attributes = [];
    var allSelected = true;
    this.state.fields.map(function(e) {
      if(e.selected){
        attributes.push(e.value);
      } else {
        allSelected = false;
      }
    });
    var position =''
    if(e != undefined){
      position = e.target.id;
    }
    else {
      position = '';
    }

    var skipValue = parseInt(this.state.skipValue), limitValue = parseInt(this.state.limit), countValue = parseInt(this.state.totalCount);
    if (position === "first") {
     skipValue = 0;
    } else if (position === "prev") {
      skipValue = (skipValue - limitValue) < 0 ? 0 : (skipValue - limitValue);
    } else if (position === "next") {
      skipValue = skipValue + limitValue;
    } else if (position === "last") {
      var docCountInLastPage = (countValue % limitValue == 0) ? limitValue : (countValue % limitValue);
      skipValue = countValue - docCountInLastPage;
    } else if (position === "") {
        countValue = countValue - 1;
        if (countValue != 0 && skipValue == countValue) {
          skipValue= skipValue - limitValue;
        }
    }
    var currentDb = this.props.currentDb;
    var currentItem = this.props.currentItem;
    var connectionId = this.props.connectionId;
    this.setState({skipValue:skipValue});
    var partialUrl = this.props.queryType == "collection" ? this.props.currentDb+'/'+this.props.currentItem+'/document?query='+this.state.query+'&connectionId='+this.props.connectionId+'&fields=' +attributes+ '&limit='+limitValue+'&skip='+skipValue+'&sortBy={'+this.state.sort+'}&allKeys=' + allSelected:
              currentDb+'/gridfs/'+currentItem+'/getfiles?query='+this.state.query+'&fields=""&limit='+this.state.limit+'&skip='+this.state.skip+'&sortBy={'+this.state.sort+'}&connectionId='+connectionId;

    var that = this;
    var queryExecutorCall4 = service('GET', partialUrl, '');
    queryExecutorCall4.then(this.success4.bind(this , currentDb, currentItem, connectionId), this.failure4.bind(this));
  }

  handleSelect(index){
    this.setState({selectedTab:index}, function(){
      autosize($('.textArea'));
    });
  }

  enableButton() {
    return function() {
      this.setState({
        canSubmit: true
      });
    }.bind(this);
  }

  disableButton() {
    return function() {
      this.setState({
        canSubmit: false
      });
    }.bind(this);
  }

  render () {
    var i =0;
    var that = this;
    var items =null;
    var items = this.state.collectionObjects.map(function (collection ,i) {
      return <Document  key={collection._id["counter"] || collection._id } uId={collection._id} key1={collection._id["counter"] || collection._id} value={JSON.stringify(collection,null,4)} onChange={this.hand.bind(this)} currentDb={this.props.currentDb} currentItem={this.props.currentItem} connectionId={this.props.connectionId} refresh={this.refresh.bind(this)} queryType = {this.props.queryType} ></Document>
    }.bind(this));

    return(
      <div className = {queryExecutorStyles.mainContainer}>

        <div className={queryExecutorStyles.buffer}>
          <div id="queryExecutor" className={queryExecutorStyles.tab}>
            <label>Query Executor</label>

          { this.props.queryType == "collection" ?
            <div className = {queryExecutorStyles.actionsContainer}>
              <div>
              <CollectionStats selectedDB={this.props.currentDb} selectedCollection={this.props.currentItem} connectionId={this.props.connectionId}></CollectionStats>
              <NewCollection queryType='collection' currentDb={this.props.currentDb} currentItem={this.props.currentItem} connectionId={this.props.connectionId} addOrUpdate={2} refreshCollectionList={this.props.refreshCollectionList.bind(this)} refreshRespectiveData = {this.props.refreshRespectiveData.bind(this)}/>
              <NewDocument currentDb={this.props.currentDb} currentItem={this.props.currentItem} connectionId={this.props.connectionId} refresh={this.refresh.bind(this,'new')} addOrEdit='Add' ></NewDocument>
              </div>
            </div>
            : <div className = {queryExecutorStyles.actionsContainer}>
              <div className={queryExecutorStyles.deleteButtonGridfs} onClick={this.openModal.bind(this)}><i className="fa fa-trash" aria-hidden="true"></i><span>Delete GridFS Bucket</span></div>
              { this.state.modalIsOpen?<DeleteComponent modalIsOpen={this.state.modalIsOpen} closeModal={this.closeModal.bind(this)} title = 'GridFS Bucket' dbName = {this.props.currentDb} gridFSName = {this.props.currentItem} connectionId={this.props.connectionId} ></DeleteComponent> : '' }
               <NewFile currentDb={this.props.currentDb} currentItem={this.props.currentItem} connectionId={this.props.connectionId} refresh={this.refresh.bind(this, 'new')}></NewFile>
              </div>
          }
          </div>
          <div>
          <div className={ this.props.queryType == "collection" ? queryExecutorStyles.queryBoxDiv : queryExecutorStyles.queryBoxDiv1}>
            <div className={queryExecutorStyles.queryBoxlabels}>
              <label>Define Query</label>
            </div>
            <div className={queryExecutorStyles.textAreaContainer}>
              <textarea id="queryBox" name="queryBox" value={this.state.query} onChange = {this.changeHandler()} className= {queryExecutorStyles.queryBox} data-search_name="query">
              </textarea>
            </div>
          </div>

          <div className = {this.props.queryType == "collection"  ? queryExecutorStyles.attrDiv : queryExecutorStyles.attrDivCollapsed}>
          { this.props.queryType == "collection" ?
             <label className={queryExecutorStyles.attributesLabel}>Attributes
               <span className={queryExecutorStyles.attributesSpan}>
                 <a onClick = {this.selectAllHandler()}>Select All</a> /
                 <a onClick = {this.unSelectAllHandler()}>Unselect All</a>
               </span>
             </label>
            : null
          }
          { this.props.queryType == "collection" ?
            <div className={queryExecutorStyles.queryAttributesDiv}>
              <ol id="attributesList" className={queryExecutorStyles.attributeList}>
                { this.state.fields.map(function(result) {
                  return <li key={result.value} className={queryExecutorStyles.attributesItems}>
                  <span className={queryExecutorStyles.checkboxSpan}><input type="checkbox" id={result.value} checked={result.selected} onChange = {that.attributeHandler({result}).bind(that)}></input></span>{result.value}</li>;
                }) }
              </ol>
            </div>
            : null
          }
          </div>
          <div className={this.props.queryType == "collection" ? queryExecutorStyles.parametersDiv : queryExecutorStyles.parametersDiv1}>
            <Form onValid={this.enableButton()} onInvalid={this.disableButton()}>
            <label htmlFor="skip"> Skip(No. of records) </label><TextInput type="text" name="skip" id="skip" value={this.state.skip} validations={{isRequired:true,isNumeric:true}} onChange={this.skipHandler()}/>
            <label htmlFor="limit"> Max page size: </label><div className = {queryExecutorStyles.selectOptions}><span><select id="limit" name="limit" onChange = {this.limitHandler()} value={this.state.limit} data-search_name="max limit" ><option value="10">10</option><option value="25">25</option><option value="50">50</option></select></span></div>
            <label htmlFor="sort"> Sort by fields </label><TextInput id="sort" type="text" onChange = {this.sortHandler()} name="sort" value={this.state.sort} data-search_name="sort" validations='isRequired' /><br />
            <button id="execQueryButton" className={queryExecutorStyles.bttnNavigable} data-search_name="Execute Query" onClick = {this.clickHandler.bind(this)} disabled ={!this.state.canSubmit}>Execute Query</button>
            </Form>
        </div>
      </div>
        </div>
        <div className={queryExecutorStyles.resultContainer} key={this.props.currentItem}>
          <div className={queryExecutorStyles.errorContainer}>{this.state.errorMessage}</div>
          <div id='paginator' className={queryExecutorStyles.paginator}>
          <a id='first' className = {(this.state.skipValue == 0 || this.state.skipValue >= this.state.totalCount)? queryExecutorStyles.disabled : ''} onClick = {this.paginationHandler.bind(this)} href='javascript:void(0)' data-search_name='First'>&laquo; First</a>
          <a id='prev'  className = {(this.state.skipValue >= this.state.totalCount || this.state.skipValue + this.state.limitValue <= this.state.limitValue)? queryExecutorStyles.disabled : ''} onClick = {this.paginationHandler.bind(this)}  href='javascript:void(0)' data-search_name='Previous'>&lsaquo; Previous</a>
          <label>Showing</label>&nbsp;<label id='startLabel'></label>{this.state.startLabel}<label> - </label>
          <label id='endLabel'>{this.state.endLabel}</label>&nbsp;<label> of </label><label id='countLabel'>{this.state.totalCount}</label>
          <a id='next' className = {(this.state.skipValue >= this.state.totalCount - this.state.limitValue)? queryExecutorStyles.disabled : ''} onClick = {this.paginationHandler.bind(this)} href='javascript:void(0)' data-search_name='Next'>Next &rsaquo;</a>
          <a id='last' className = {(this.state.skipValue + this.state.limitValue >= this.state.totalCount )? queryExecutorStyles.disabled : ''} onClick = {this.paginationHandler.bind(this)} href='javascript:void(0)' data-search_name='Last'>Last &raquo;</a>
          </div>
          <Tabs selectedIndex={this.state.selectedTab} onSelect={this.handleSelect.bind(this)}>
            <TabList className={queryExecutorStyles.treeTab}>
              <Tab><span className={this.state.selectedTab==0 ? queryExecutorStyles.activeTab : ''}>JSON</span></Tab>
              <Tab><span className={this.state.selectedTab==1 ? queryExecutorStyles.activeTab : ''}>Tree Table</span></Tab>
            </TabList>
            <TabPanel>
              {items.length>0 ? items: <span className={queryExecutorStyles.exceptionContainer}>No Documents to be displayed</span>}
            </TabPanel>
            <TabPanel>
              <TreeView collectionObjects = {this.state.collectionObjects} currentDb={this.props.currentDb} currentItem={this.props.currentItem} connectionId={this.props.connectionId} refresh={this.refresh.bind(this)} queryType={this.props.queryType}></TreeView>
            </TabPanel>
          </Tabs>
        </div>
      </div>
    );
  }
}

export default QueryExecutorComponent;
