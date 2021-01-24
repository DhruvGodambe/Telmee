import React, {Component} from 'react';
import './TextEditor.css';
import {Editor, EditorState, RichUtils, convertToRaw, convertFromRaw} from 'draft-js';
import 'draft-js/dist/Draft.css';
// import FormatUnderlinedSharpIcon from '@material-ui/icons/FormatUnderlinedSharp';
//Font awesome icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faListOl, faBold, faItalic, faUnderline } from '@fortawesome/free-solid-svg-icons';

class Editors extends Component{
  constructor(props) {
    super(props);
    console.log(this.props)
    this.state = {editorState: EditorState.createEmpty()};
    this.onChange = editorState => {
    //   let contentState = editorState.getCurrentContent();
      this.setState({editorState: editorState});
      this.props.setDescription(convertToRaw(editorState.getCurrentContent()));
    };
  }

  componentDidMount() {
    if(this.props.raw){
      console.log(true);
      this.setState({
        editorState: EditorState.createWithContent(convertFromRaw(this.props.raw))
      })
    }
  }

  handleKeyCommand = (command) => {
    const newState = RichUtils.handleKeyCommand(this.state.editorState, command);
    if (newState) {
      this.onChange(newState);
      return 'handled';
    }
    return 'not-handled';
  }

    onItalicClick = () => {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'ITALIC'))
     }

     onBoldClick = () => {
      this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'))
     }

     onUnderlineClick = () => {
      this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'UNDERLINE'))
     }

     onULClick = () => {
      this.onChange(RichUtils.toggleBlockType(this.state.editorState, 'unordered-list-item'))
     }

     onOLClick = () => {
      this.onChange(RichUtils.toggleBlockType(this.state.editorState, 'ordered-list-item'))
     }

  render() {
    return (
      <div className='editor'>
        <Editor 
            editorState={this.state.editorState} 
            placeholder="Give a brief description" 
            onChange={this.onChange} 
            handleKeyCommand={this.handleKeyCommand}
            className='editor__textarea'
          />
        <div className='editor__buttons'>
            <div className='editor-icons' onClick={this.onBoldClick}>
                <FontAwesomeIcon icon={faBold} style={{fontSize: '16px'}}/>
            </div>
            <div className='editor-icons' onClick={this.onItalicClick}>
                <FontAwesomeIcon icon={faItalic} style={{fontSize: '16px'}}/>
            </div>
            <div className='editor-icons' onClick={this.onUnderlineClick}>
                <FontAwesomeIcon icon={faUnderline} style={{fontSize: '16px'}}/>
            </div>
            <div className='editor-icons' onClick={this.onULClick}>
              <FontAwesomeIcon icon={faList} style={{fontSize: '16px'}}/>
            </div>
            <div className='editor-icons' onClick={this.onOLClick}>
              <FontAwesomeIcon icon={faListOl} style={{fontSize: '16px'}}/>
            </div>
        </div>
             
      </div>
    );
  }
}

export default Editors;