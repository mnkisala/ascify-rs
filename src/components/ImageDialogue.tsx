import { Buffer } from "buffer";
import * as tauri from "@tauri-apps/api";

import InputButton from "./InputButton";

interface ImageDialogueProps {
  setData: (data: Promise<string>) => void;
  close?: () => void;
}

const ImageDialogue: React.FC<ImageDialogueProps> = ({ setData, close }) => {
  return (
    <div className="image_dialogue-container">
      <div className="image_dialogue">
        <div className="image_dialogue-main">
          <FileInput
            onSubmit={(data) => {
              setData(data);
              close && close();
            }}
          />

          <p>or</p>

          <InputButton
            placeholder="url..."
            onSubmit={(url) => {
              close && close();

              setData(
                tauri.http
                  .fetch<string>(url, {
                    method: "GET",
                    responseType: tauri.http.ResponseType.Binary,
                  })
                  .then((r) => r.data)
                  .then((d) => Buffer.from(d).toString("base64"))
              );
            }}
          >
            use URL
          </InputButton>
        </div>

        <button className="close-button" onClick={close}>
          cancel
        </button>
      </div>
    </div>
  );
};

interface FileInputProps {
  onSubmit: (data: Promise<string>) => void;
}

const FileInput: React.FC<FileInputProps> = ({ onSubmit }) => {
  return (
    <div className="file_input-container">
      <input
        type="file"
        onChange={(e) => {
          if (e.target.files != null) {
            const files = e.target.files;
            if (files[0] != null) {
              const file = files[0];
              const data = file
                .arrayBuffer()
                .then((buffer) => Buffer.from(buffer).toString("base64"));
              onSubmit(data);
            }
          }
        }}
      />
    </div>
  );
};

export default ImageDialogue;
