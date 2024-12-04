import React, { useEffect, useRef } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import CustomEditor from 'ckeditor5-custom-build';
import { Box, Typography } from '@mui/material';
import { ReactJSXElementType } from '@emotion/react/types/jsx-namespace';

//  ------------------------SAMPLE------------------------
//  <CKEditor
//   value={val}
//   onChangeValue={(value) => setVal(value)}
//   injectionText="text"
//   error="it is req"
//   ErrorComponent={ErrShow}
//   ResetWrapper={ResetStyleWrapper}
//   title="Editor"
//   required={true}
// />

const toolbar: string[] = [
  'heading',
  'style',
  '|',
  'bold',
  'italic',
  'underline',
  'strikethrough',
  'fontSize',
  'fontColor',
  'fontFamily',
  'specialCharacters',
  '|',
  'blockQuote',
  'outdent',
  'indent',
  'alignment',
  '|',
  'bulletedList',
  'numberedList',
  '|',
  'undo',
  'redo',
  '|',
  'removeFormat',
  'selectAll',
  'accessibilityHelp',
];

const uploadFileExts: string[] = ['.pdf', '.doc', '.docx', '.xls', '.xlsx'];
const imageUploadExts: string[] = ['mpeg', 'jpg', 'png', 'jpeg'];

interface ICKEditorComponentProps {
  value: string;
  onChangeValue: (value: string) => void;
  injectionText?: string;
  error?: string;
  ErrorComponent?: ReactJSXElementType;
  ResetWrapper?: ReactJSXElementType;
  required?: boolean;
  title?: string;
}
const CKEditorComponent = (props: ICKEditorComponentProps) => {
  const {
    value,
    onChangeValue,
    injectionText,
    error,
    ErrorComponent,
    ResetWrapper,
    required,
    title,
  } = props;
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef && editorRef?.current) {
      const editor = editorRef?.current?.editor;
      editor?.model?.change(writer => {
        const insertPosition =
          editor.model.document.selection.getFirstPosition();
        writer.insertText(`{{${injectionText}}}`, insertPosition);
      });
    }
  }, [injectionText]);

  const editorConfiguration = {
    extraPlugins: [uploadPlugin],
    toolbar: {
      items: toolbar,
      shouldNotGroupWhenFull: false,
    },
    simpleUpload: {
      uploadUrl: `https://sample.com/files/editor`, //TODO: change it to real url
      fileTypes: uploadFileExts,
    },
    image: {
      upload: { types: imageUploadExts },
    },
  };
  const Wrapper = ResetWrapper ?? Box;

  return (
    <>
      {title && (
        <Typography>
          {title} {required && '*'}
        </Typography>
      )}
      <Wrapper>
        <CKEditor
          ref={editorRef}
          editor={CustomEditor as any}
          config={editorConfiguration}
          data={value}
          onChange={(event, editor) => {
            onChangeValue(editor.getData());
          }}
        />
      </Wrapper>
      {ErrorComponent && error ? (
        <ErrorComponent err={error} />
      ) : (
        <Typography variant='body1' className='!text-red-600'>
          {error}
        </Typography>
      )}
    </>
  );
};

export default CKEditorComponent;

// upload Adaptor
// TODO: add type to variables - implement uploading when it needed

// upload Adaptor
function uploadAdapter(loader) {
  return {
    upload: () => {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
        // const fd = new FormData();
        loader.file.then(file => {
          // TODO:here check the mimetype and send request to relevant backend api endpoint
          // axios
          //   .post(`https://sample.com/files/${endPoint}`, fd)
          //   .then((res) => {
          //     resolve({
          //       default: res.data[0].fileAddress
          //     })
          //   })
          //   .catch((err) => {
          //     reject(err)
          //   })
        });
      });
    },
  };
}

function uploadPlugin(editor) {
  editor.plugins.get('FileRepository').createUploadAdapter = loader => {
    return uploadAdapter(loader);
  };

  // when upload completes, replace tag
  const imageUploadEditing = editor.plugins.get('ImageUploadEditing');
  imageUploadEditing.on('uploadComplete', (evt, { data, imageElement }) => {
    editor.model.change(writer => {
      const view = editor.data.processor.toView(
        data.mediaType === 'video'
          ? `<video src='${data.default}' controls="controls"></video>`
          : data.mediaType === 'audio'
          ? `<audio src='${data.default}' controls="controls"></audio>`
          : `<img src='${data.default}' />`,
      );
      const model = editor.data.toModel(view);
      editor.model.insertContent(model, editor.model.document.selection);
    });

    evt.stop();
    editor.editing.view.focus();
  });
}
