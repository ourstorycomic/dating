import re

with open('d:/dating/components/dashboard/OrderBuilderForm.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

dating2_ui = '''
            ) : isDating2 ? (
              <div className="md:col-span-2 grid gap-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  {[1, 1.5, 2, 3, 4, 5, 6].map((s, idx) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setDating2Config({ ...dating2Config, previewStep: s })}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${dating2Config.previewStep === s ? "bg-pink-500 text-white" : "bg-white/10 text-white/70 hover:bg-white/20"}`}
                    >
                      {idx === 0 ? "Mật mã" : idx === 1 ? "Radio" : idx === 2 ? "Tâm trạng" : idx === 3 ? "Thẻ cào" : idx === 4 ? "Vòng quay" : idx === 5 ? "Thời gian" : "Lá thư"}
                    </button>
                  ))}
                </div>
                
                <div className="grid gap-4 md:grid-cols-2 p-5 bg-white/[0.03] border border-white/10 rounded-2xl">
                  {dating2Config.previewStep === 1 && (
                    <>
                      <TextInput label="Mật mã mở khóa (4 số)" value={dating2Config.pinCode} onChange={(v) => setDating2Config({ ...dating2Config, pinCode: v })} />
                      <TextInput label="Tên người nhận (để xưng hô)" value={recipientName} onChange={setRecipientName} />
                    </>
                  )}
                  {dating2Config.previewStep === 1.5 && (
                    <>
                      <TextInput label="Gợi ý dò đài Radio" value={dating2Config.radioHint} onChange={(v) => setDating2Config({ ...dating2Config, radioHint: v })} />
                      <TextInput label="Link nhạc nền chung (.mp3)" value={generalAudioUrl} onChange={setGeneralAudioUrl} />
                    </>
                  )}
                  {dating2Config.previewStep === 2 && (
                    <>
                      <TextArea label="Tiêu đề hỏi thăm" value={dating2Config.vibeTitle} onChange={(v) => setDating2Config({ ...dating2Config, vibeTitle: v })} />
                      <TextInput label="Câu tooltip dỗ dành" value={dating2Config.vibeTooltip} onChange={(v) => setDating2Config({ ...dating2Config, vibeTooltip: v })} />
                      <div className="md:col-span-2">
                         <ArrayInput label="Các lựa chọn tâm trạng" values={dating2Config.vibeOptions} onChange={(v) => setDating2Config({ ...dating2Config, vibeOptions: v })} />
                      </div>
                    </>
                  )}
                  {dating2Config.previewStep === 3 && (
                    <>
                      <TextInput label="Tiêu đề thẻ cào" value={dating2Config.scratchTitle} onChange={(v) => setDating2Config({ ...dating2Config, scratchTitle: v })} />
                      <TextInput label="Phụ đề (HD cào)" value={dating2Config.scratchSubtitle} onChange={(v) => setDating2Config({ ...dating2Config, scratchSubtitle: v })} />
                      <TextArea label="Phần thưởng sau lớp cào" value={dating2Config.scratchPrize} onChange={(v) => setDating2Config({ ...dating2Config, scratchPrize: v })} />
                      <TextInput label="Nút bấm nhận quà" value={dating2Config.scratchBtn} onChange={(v) => setDating2Config({ ...dating2Config, scratchBtn: v })} />
                    </>
                  )}
                  {dating2Config.previewStep === 4 && (
                    <>
                      <TextInput label="Tiêu đề vòng quay" value={dating2Config.wheelTitle} onChange={(v) => setDating2Config({ ...dating2Config, wheelTitle: v })} />
                      <TextInput label="Nút bấm sau khi quay" value={dating2Config.wheelBtn} onChange={(v) => setDating2Config({ ...dating2Config, wheelBtn: v })} />
                      <div className="md:col-span-2">
                         <ArrayInput label="Các tùy chọn trên vòng quay (Tối đa 6)" values={dating2Config.wheelOptions} onChange={(v) => setDating2Config({ ...dating2Config, wheelOptions: v })} />
                      </div>
                    </>
                  )}
                  {dating2Config.previewStep === 5 && (
                    <>
                      <TextInput label="Tiêu đề thời gian" value={dating2Config.dtTitle} onChange={(v) => setDating2Config({ ...dating2Config, dtTitle: v })} />
                      <TextInput label="Nút hoàn tất chọn giờ" value={dating2Config.dtBtn} onChange={(v) => setDating2Config({ ...dating2Config, dtBtn: v })} />
                      <div className="md:col-span-2">
                         <ArrayInput label="Các tùy chọn Ngày" values={dating2Config.dtDates} onChange={(v) => setDating2Config({ ...dating2Config, dtDates: v })} />
                         <div className="h-4" />
                         <ArrayInput label="Các tùy chọn Giờ" values={dating2Config.dtTimes} onChange={(v) => setDating2Config({ ...dating2Config, dtTimes: v })} />
                      </div>
                    </>
                  )}
                  {dating2Config.previewStep === 6 && (
                    <>
                      <TextInput label="Tiêu đề lá thư" value={dating2Config.finaleLetterTitle} onChange={(v) => setDating2Config({ ...dating2Config, finaleLetterTitle: v })} />
                      <TextInput label="Tên người gửi (ký tên cuối thư)" value={senderName} onChange={setSenderName} />
                      <TextArea label="Nội dung lá thư" value={dating2Config.finaleLetterBody} onChange={(v) => setDating2Config({ ...dating2Config, finaleLetterBody: v })} />
                      <TextInput label="Nút bấm Từ Chối" value={dating2Config.finaleBtnNo} onChange={(v) => setDating2Config({ ...dating2Config, finaleBtnNo: v })} />
                      <TextInput label="Nút bấm Đồng Ý" value={dating2Config.finaleBtnYes} onChange={(v) => setDating2Config({ ...dating2Config, finaleBtnYes: v })} />
                      <TextInput label="Lời nhắn chốt đơn thành công" value={dating2Config.finaleBtnSuccess} onChange={(v) => setDating2Config({ ...dating2Config, finaleBtnSuccess: v })} />
                    </>
                  )}
                </div>

                <div className="flex justify-between mt-2">
                  <button
                    type="button"
                    onClick={() => {
                       const steps = [1, 1.5, 2, 3, 4, 5, 6];
                       const curr = steps.indexOf(dating2Config.previewStep);
                       if(curr > 0) setDating2Config({ ...dating2Config, previewStep: steps[curr-1] });
                    }}
                    className="px-6 py-2 rounded-xl bg-white/5 text-white/70 hover:bg-white/10 hover:text-white transition disabled:opacity-30"
                    disabled={dating2Config.previewStep === 1}
                  >
                    &larr; Cảnh trước
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                       const steps = [1, 1.5, 2, 3, 4, 5, 6];
                       const curr = steps.indexOf(dating2Config.previewStep);
                       if(curr < steps.length - 1) setDating2Config({ ...dating2Config, previewStep: steps[curr+1] });
                    }}
                    className="px-6 py-2 rounded-xl bg-pink-500/20 text-pink-300 border border-pink-500/30 hover:bg-pink-500/40 hover:text-white transition disabled:opacity-30"
                    disabled={dating2Config.previewStep === 6}
                  >
                    Cảnh tiếp &rarr;
                  </button>
                </div>
              </div>
            ) : isWillYouDateMe ? (
'''

if 'isDating2 ? (' not in content:
    content = content.replace('            ) : isWillYouDateMe ? (', dating2_ui)

with open('d:/dating/components/dashboard/OrderBuilderForm.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
