import React from 'react'
import collectionListStyles from './collectionlist.css'
import $ from 'jquery'
class CollectionItemComponent extends React.Component {

 constructor(props) {
      super(props);
      this.state = {
          hover_flag: false
      }
  }

  render () {
         return (
             <div className={(this.props.isSelected ? collectionListStyles.menuItem +' ' +collectionListStyles.highlight :collectionListStyles.menuItem)} key={this.props.name} >
               <span>
                 <i className="fa fa-folder-open-o" aria-hidden="true"></i>
               </span>
               <button onClick={this.props.onClick} value={this.props.name}>{this.props.name}</button>
            </div>
         );
     }

  }
  CollectionItemComponent.getDefaultProps = {
          isSelected: false
  }
  CollectionItemComponent.propTypes = {
         onClick: React.PropTypes.func.isRequired,
         isSelected: React.PropTypes.bool
     }

export default CollectionItemComponent;
