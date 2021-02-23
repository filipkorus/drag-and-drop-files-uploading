const formData = new FormData();
const xhr = new XMLHttpRequest();
const submitBtn = document.getElementById('submitBtn');
const clearColumnsBtn = document.getElementById('clearColumnsBtn');
const progressBar = document.getElementById('progressbar');
const droparea = document.getElementById('droparea');
const filesToUpload = document.getElementById('filesToUpload');
const uploadStatus = document.getElementById('uploadStatus');
const fileInput = document.getElementById('file');
var files = [];
var fileCount = 0;
var uploading = false;

droparea.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', () => {
   if (!uploading) {
      filesToUpload.style.display = 'block';

      for (const file of fileInput.files) {
         formData.append("myFiles[]", file);
         filesToUpload.innerHTML += `${file.name}<br>`;
         fileCount += 1;
      }
   }
});

droparea.addEventListener('dragover', (e) => {
   e.preventDefault();
   droparea.innerHTML = '';
   droparea.classList.add('dragging');
   droparea.classList.remove('bg-dark');
   droparea.classList.add('bg-secondary');
});

droparea.addEventListener('dragleave', () => {
   droparea.innerHTML = '<b>Choose a file</b> or drag it here!';
   droparea.classList.remove('dragging');
   droparea.classList.add('bg-dark');
   droparea.classList.remove('bg-secondary');
});

droparea.addEventListener('drop', (e) => {
   e.preventDefault();
   if (!uploading) {
      droparea.innerHTML = '<b>Choose a file</b> or drag it here!';
      droparea.classList.remove('dragging');
      droparea.classList.add('bg-dark');
      droparea.classList.remove('bg-secondary');

      filesToUpload.style.display = 'block';
      Array.from(e.dataTransfer.files).forEach(file => {
         formData.append("myFiles[]", file);
         filesToUpload.innerHTML += `${file.name}<br>`;
         fileCount += 1;
      });
   }
});

submitBtn.addEventListener('click', () => {
   if (formData.get('myFiles[]')) {
      if (!uploading) {
         submitBtn.classList.remove('btn-primary');
         submitBtn.classList.add('btn-secondary');
         submitBtn.innerHTML = 'Cancel Uploading';
         upload();
         uploading = true;
      } else {
         xhr.abort();
         uploading = false;
         reset();
      }
   }
});

function upload() {

   xhr.upload.addEventListener("progress", success => {
      if (success.lengthComputable) {
         var progress = (success.loaded / success.total) * 100;
         progress = progress.toFixed(0);
         progressbar.style.width = progress + '%';
      }
   }, false);

   xhr.onabort = () => console.log('Uploading aborted!');

   xhr.onload = function () {
      if (this.status == 200) {
         if (this.responseText) {
            console.log(this.responseText);
            const data = JSON.parse(this.responseText);
            data.forEach(row => {
               if (row.success) {
                  if (row.file_name === row.new_file_name) uploadStatus.innerHTML += `<span class="badge bg-success">SUCCESS</span><br>`;
                  else uploadStatus.innerHTML += `<span class="badge bg-warning text-dark">${row.new_file_name}</span><br>`;
               }
               else uploadStatus.innerHTML += `<span class="badge bg-danger">ERROR</span><br>`;
            });
            reset();
         }
      }
   }

   xhr.open('POST', 'upload.php');
   xhr.send(formData);
}

function countOccurences(string, word) {
   return string.split(word).length - 1;
}

function reset() {
   if (!uploading) {
      for (var i = 0; i < fileCount; i += 1) {
         uploadStatus.innerHTML += '<span class="badge bg-secondary">CANCELLED</span><br>';
      }
   }
   fileCount = 0;
   progressbar.style.width = '0%';
   formData.delete('myFiles[]');
   submitBtn.innerHTML = 'Upload Files';
   submitBtn.classList.remove('btn-secondary');
   submitBtn.classList.add('btn-primary');
   uploading = false;
}

clearColumnsBtn.addEventListener('click', clear);

function clear() {
   if (formData.get('myFiles[]')) {
      alert('Upload your files first!');
   } else {
      filesToUpload.innerHTML = '<h6 class="font-weight-bold my-1">Files to Upload</h6>';
      uploadStatus.innerHTML = '<h6 class="font-weight-bold my-1">Upload Status</h6>';
   }
}