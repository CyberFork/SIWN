import { Modal, Button } from 'antd'
import {
  PictureOutlined,
  LinkOutlined,
  CloudUploadOutlined,
  HighlightOutlined,
} from '@ant-design/icons'
import { useState, useEffect, useRef, useCallback } from 'react'
import { Upload, notification } from 'antd'
import MyEditor, { getHTML, parseHTML } from './MyEditor'
import Loading from '../components/Loading'

import { publishTweet, reTweet } from '../api'
const { Dragger } = Upload

function PostModal(props) {
  const [isLoading, setIsLoading] = useState(false)
  const handleCancel = () => {
    props.dispatch({ type: 'hidePostModal' })
  }

  const [index, setIndex] = useState(0)
  const [content, setContent] = useState(
    props.store.modal.data.content
      ? parseHTML(props.store.modal.data.content)
      : '',
  )
  const [fileList, setFileList] = useState([])
  const textarea = useRef()


  async function submit() {
    setIsLoading(true)

    if (index === 1 && fileList.length === 0)
      return notification.error({
        message: 'Please upload at least one picture',
        placement: 'bottom',
      })
    const _content = getHTML(content)
    if (!_content) {
      notification.error({
        message: 'The content can not be null',
        placement: 'bottom',
      })
      return
    }
    publishTweet({ mediaType: 0, content: _content })
      .then((res) => {
        if (Number(res.code) !== 200) {
          notification.error({
            message: 'Please try again',
            placement: 'bottom',
          })
        } else {
          notification.success({
            message: 'Published successfully',
            placement: 'bottom',
          })
          props.dispatch({ type: 'hidePostModal' })
          props.dispatch({ type: 'addTweet' })
        }
      })
      .finally(setIsLoading(false))
  }

  const footer = (
    <div className={'t-center'}>
      <Button
        type={'primary'}
        size={'large'}
        className={'w100'}
        onClick={submit}
      >
        Post
      </Button>
    </div>
  )

  useEffect(() => {
    setIndex(props.store.modal.data.type)
    if (props.store.modal.data.type === 1) {
      let images = props.store.modal.data.images
      setFileList(
        images.map((d, i) => {
          return {
            uid: -i,
            name: 'image' + i,
            status: 'done',
            url: d,
          }
        }),
      )
    }
  }, [props.store.modal.data.type])


  useEffect(() => {

    setContent(
      props.store.modal.data.content
        ? parseHTML(props.store.modal.data.content)
        : '',
    )
  }, [props.store.modal.data.content])

  function onChange({ file, fileList, event }) {
    if (file.status === 'error') {
      return notification.error({
        message: 'Upload Failed',
        placement: 'bottom',
      })
    }
    setFileList(fileList)
  }


  function contentChange(v) {
    setContent(v)
  }
  function beforeUpload(file) {
    if (!/image/i.test(file.type)) {
      notification.error({ message: `Wrong file type`, placement: 'bottom' })
      return false
    }
    if (fileList.length === 4) {
      notification.error({
        message: `Only 4 images can be upload`,
        placement: 'bottom',
      })
      return false
    }
    return true
  }

  return (
    <>
      {isLoading ? (
        <Loading visible={true} />
      ) : (
        <Modal
          visible={props.store.modal.isPostModalVisible}
          onCancel={handleCancel}
          title={'CreatePost'}
          footer={footer}
          centered={true}
        >
          <div className={'post-modal-type'}>
            <div
              className={index === 0 ? 'selected' : ''}
              onClick={() => setIndex(0)}
            >
              <HighlightOutlined />
              Post
            </div>
            <div
              className={index === 1 ? 'selected' : ''}
              onClick={() => setIndex(1)}
            >
              <PictureOutlined />
              Image
            </div>
            {/*<div className={index === 2 ? 'selected': ''} onClick={() => setIndex(2)}><LinkOutlined/>Link</div>*/}
          </div>
          {/* <div className={'post-modal-title'}>
                <div>Title</div>
                <div>{count}/300</div>
            </div>
            <textarea ref={textarea} maxLength={300} className="post-modal-input" value={value} onInput={e => {setValue(e.target.value.trim().slice(0, 300))}}>{value}</textarea> */}
          {/* <div className={'post-modal-title'}>
                <div>Text</div>
                <div>
                </div>
            </div> */}
          <MyEditor
            value={content}
            onChange={contentChange}
            store={props.store}
          />
          {index === 1 && (
            <>
              <div className={'post-modal-title'}>
                <div>Images</div>
                <div></div>
              </div>
              <Dragger
                name="file"
                action="/"
                accept=".jpeg,.gif,.png,.jpg"
                maxCount={4}
                listType="picture"
                onChange={onChange}
                beforeUpload={beforeUpload}
                defaultFileList={fileList}
              >
                <p className="drag-file-icon">
                  <CloudUploadOutlined />
                </p>
                <p className="drag-file-desc">
                  Click or drag image file to this area to upload
                </p>
              </Dragger>
            </>
          )}
          {index === 2 && (
            <>
              <div className={'post-modal-title'}>
                <div>URL</div>
                <div></div>
              </div>
              <input type="text" className="post-modal-url" />
            </>
          )}
        </Modal>
      )}
    </>
  )
}

export default PostModal
