import {
  convertFromHTML as htmlToState,
  convertToHTML as stateToHTML,
} from 'draft-convert';
import { ContentState, EditorState } from 'draft-js';

export const convertFromHTML = (html, metadata = {}) => {
  return htmlToState({
    htmlToStyle: (nodeName, node, currentStyle) => {
      if (node.style.textAlign) {
        if (node.style.fontSize) {
          return currentStyle
            .add(`ALIGN_${node.style.textAlign.toUpperCase()}`)
            .add(`fontsize-${node.style.fontSize.replace(/px$/g, '')}`);
        } else {
          return currentStyle.add(
            `ALIGN_${node.style.textAlign.toUpperCase()}`,
          );
        }
      }

      if (node.style.fontSize)
        return currentStyle.add(
          `fontsize-${node.style.fontSize.replace(/px$/g, '')}`,
        );
      return currentStyle;
    },
  })(html);
};

export const modifyEmptyParagraphs = contentState => {
  const blocks = contentState.getBlockMap().toArray();
  const newBlocks = blocks.map(block => {
    if (block.getText().trim() === '') {
      const modifiedBlock = block.merge({
        text: '', // '\u00a0' is the unicode for &nbsp;
      });
      return modifiedBlock;
    }
    return block;
  });
  const newContentState = ContentState.createFromBlockArray(newBlocks);
  return newContentState;
};

export const handleGetHTML = (editorState: EditorState) => {
  const trimmedContent = modifyEmptyParagraphs(editorState.getCurrentContent());
  return trimmedContent &&
    convertToHTML(trimmedContent).toString().trim() !== '<p></p>' &&
    convertToHTML(trimmedContent).toString().trim() !== "<p style=''></p>"
    ? convertToHTML(trimmedContent)
        .replaceAll('</ul><ul>', '')
        .replaceAll('</ol><ol>', '')
    : '';
};

function convertStyleToString(styleObject) {
  return Object.entries(styleObject)
    .map(([property, value]) => `${property}:${value}`)
    .join(';');
}

export const convertToHTML = contentState => {
  return stateToHTML({
    blockToHTML: block => {
      let element;
      let wrapperElement;
      switch (block.type) {
        case 'ordered-list-item':
          element = 'li';
          wrapperElement = 'ol';
          break;
        case 'unordered-list-item':
          element = 'li';
          wrapperElement = 'ul';
          break;
        case 'header-one':
          element = 'h1';
          break;
        case 'header-two':
          element = 'h2';
          break;
        case 'header-three':
          element = 'h3';
          break;
        case 'header-four':
          element = 'h4';
          break;
        case 'header-five':
          element = 'h5';
          break;
        case 'header-six':
          element = 'h6';
          break;
        default:
          element = 'p';
          break;
      }
      let finalHtml = '';

      let details = {};

      if (block?.inlineStyleRanges.length > 0) {
        if (
          (block?.inlineStyleRanges.length === 1 &&
            block?.inlineStyleRanges[0].offset !== 0) ||
          !block?.inlineStyleRanges.reduce((item, lastItem) => {
            return (
              item.offset === lastItem.offset &&
              item.length === lastItem.length &&
              item.offset !== 0
            );
          })
        ) {
          block?.text?.split('').forEach((char, i) => {
            const styles = [];
            block?.inlineStyleRanges.forEach(item => {
              if (item.offset <= i && item.offset + item.length > i) {
                styles.push(item);
              }
            });
            details[i] = { ...block, text: char, inlineStyleRanges: styles };
          });
        } else {
          details = { 0: block };
        }
        let textAlign = '';
        const results = Object.keys(details).map(innerBlock => {
          const style = details[innerBlock]?.inlineStyleRanges?.reduce(
            (styles, range) => {
              let style = '';
              if (
                range.style === 'ALIGN_CENTER' &&
                !details[innerBlock].data['text-align']
              )
                textAlign += `text-align:center;`;
              if (
                range.style === 'ALIGN_RIGHT' &&
                !details[innerBlock].data['text-align']
              )
                textAlign += `text-align:right;`;
              if (
                range.style === 'ALIGN_LEFT' &&
                !details[innerBlock].data['text-align']
              )
                textAlign += `text-align:left;`;
              if (range.style?.includes('fontsize')) {
                style += `font-size:${range.style.split('-')[1]}px;`;
              }

              if (range.style?.includes('BOLD')) style += `font-weight:bold;`;

              if (range.style?.includes('UNDERLINE'))
                style += `text-decoration:underline;`;

              if (range.style?.includes('ITALIC'))
                style += `font-style:italic;`;

              return `${styles}${style}`;
            },
            '',
          );
          return `<span style="${style ?? ''}">${
            details[innerBlock].text
          }</span>`;
        });
        finalHtml = `<${element} style="${
          convertStyleToString(block.data) ?? ''
        };${textAlign ?? ''};display:flex">${results.join('')}</${element}>`;
      } else {
        finalHtml = `<${element} "style="${
          convertStyleToString(block.data) ?? ''
        }">${block.text}</${element}>`;
      }

      return wrapperElement
        ? `${wrapperElement ? `<${wrapperElement}>` : ``}${finalHtml}${
            wrapperElement ? `</${wrapperElement}>` : ``
          }`
        : finalHtml;
    },
  })(contentState);
};
