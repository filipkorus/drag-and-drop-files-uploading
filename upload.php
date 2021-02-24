<?php
if ($_SERVER['REQUEST_METHOD'] === "POST") {

   header('Content-Type: application/json');

   if (isset($_FILES["myFiles"])) {

      $uploaded = array();

      foreach ($_FILES['myFiles']['tmp_name'] as $key => $value) {

         $upload_folder = './uploads/';

         $target_dir = $upload_folder . basename($_FILES['myFiles']['name'][$key]);

         $file_count = 1;
         $new_dir = $target_dir;
         while (file_exists($new_dir)) {
            $new_dir = $target_dir;
            $new_dir = substr($new_dir, 0, strrpos($new_dir, ".")) . "($file_count)" . substr($new_dir, strrpos($new_dir, "."));
            $file_count++;
         }
         
         $success = move_uploaded_file($value, $new_dir);

         array_push($uploaded, array(
            'success' => $success,
            'file_name' => $_FILES['myFiles']['name'][$key],
            'new_file_name' => str_replace('./uploads/', '', $new_dir)
         ));
      }

      echo json_encode($uploaded);
   }
}
