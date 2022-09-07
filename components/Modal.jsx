import React, { useState } from 'react';
import ModalBasic from './ModalBasic';
import { MbButton } from 'mintbase-ui';


function Modal(props) {
    const [feedbackModalOpen, setFeedbackModalOpen] = useState(false)

    // console.log("Modal: ", props.feedbackModalOpen);
    return (
        <>
            {/* <button className="btn bg-indigo-500 hover:bg-indigo-600 text-white" aria-controls="feedback-modal" onClick={(e) => { e.stopPropagation(); setFeedbackModalOpen(true); }}>Send Feedback</button> */}
          <ModalBasic id="feedback-modal" modalOpen={props.feedbackModalOpen} setModalOpen={props.setFeedbackModalOpen} title={props.title || ''}>
            {/* Modal content */}
            <div className="px-5 py-4">
              <div className="text-sm">
                <div className="font-medium text-slate-800 mb-3">{props.description || ''} 🙌</div>
              </div>
              <div className="space-y-3">
                {props.children}
                {/* <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="name">Name <span className="text-rose-500">*</span></label>
                  <input id="name" className="form-input w-full px-2 py-1" type="text" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="email">Email <span className="text-rose-500">*</span></label>
                  <input id="email" className="form-input w-full px-2 py-1" type="email" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="feedback">Message <span className="text-rose-500">*</span></label>
                  <textarea id="feedback" className="form-textarea w-full px-2 py-1" rows="4" required></textarea>
                </div> */}
              </div>
            </div>
            {/* Modal footer */}
            <div className="px-5 py-4 border-t border-slate-200">
              <div className="flex flex-wrap justify-end space-x-2">
                <MbButton label='Cancel' className="border-slate-200 hover:border-slate-300 text-slate-600" onClick={(e) => { props.setFeedbackModalOpen(false); }} />
                <MbButton style={{ background: 'rgb(99, 102, 241)', color: 'white'}} label={`${props?.btnMessage ? props?.btnMessage : 'create'}`} onClick={() => {  props.setFeedbackModalOpen(false); }} />
                {/* <button className="btn-sm border-slate-200 hover:border-slate-300 text-slate-600" onClick={(e) => { e.stopPropagation(); setFeedbackModalOpen(false); }}>Cancel</button> */}
                {/* <button className="btn-sm bg-indigo-500 hover:bg-indigo-600 text-white">Send</button> */}
              </div>
            </div>
          </ModalBasic>
        </>
    )
}


export default Modal;