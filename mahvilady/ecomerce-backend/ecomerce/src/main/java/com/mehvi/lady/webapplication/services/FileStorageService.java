package com.mehvi.lady.webapplication.services;

import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface FileStorageService {
    String storeFile(MultipartFile file, String customFileName, String subDirectory);

    String storeFile(MultipartFile file, String customFileName, String oldFileName, String subDirectory);

    List<String> storeFiles(MultipartFile[] files, String customFilePrefix, String subDirectory);

    List<String> storeFiles(MultipartFile[] files, String customFilePrefix, List<String> oldFileNames, String subDirectory);
}
