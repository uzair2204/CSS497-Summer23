package com.mehvi.lady.webapplication.services.impl;

import com.mehvi.lady.webapplication.services.FileStorageService;
import com.mehvi.lady.webapplication.utils.CommonUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class FileStorageServiceImpl implements FileStorageService {
    Logger logger = LogManager.getLogger(this.getClass());


    private final Path uploadPath;

    private final Boolean isDeleteOldFile;

    public FileStorageServiceImpl(@Value("${file.upload-dir}") String path, @Value("${file.delete-old}") Boolean isDeleteOldFile) throws IOException {
        this.uploadPath = Paths.get(path);
        this.isDeleteOldFile = isDeleteOldFile;
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
    }

    public String store(MultipartFile file, String customFileName, String subDirectory) {

        try {
            String originalFileName = file.getOriginalFilename();

            String fullFileName = customFileName + "_" + originalFileName;
            Path filePath = uploadPath.resolve(subDirectory);
            if (!Files.exists(filePath)) {
                Files.createDirectories(filePath);
            }
            logger.info("storing file with NewName: {} against originalFileName:{}", fullFileName, originalFileName);
            Files.copy(file.getInputStream(), filePath.resolve(fullFileName), StandardCopyOption.REPLACE_EXISTING);
            return String.format("%s/%s", subDirectory, fullFileName);
        } catch (IOException ex) {
            throw new RuntimeException("could not store file " + customFileName, ex);
        }
    }

    public void delete(String file) {
        try {
            if(!CommonUtils.isNullOrEmptyString(file)) {
                Path filePath = uploadPath.resolve(file);
                logger.info("deleting file with fileName:{}", file);
                Files.deleteIfExists(filePath);
            }

        } catch (IOException ex) {
            throw new RuntimeException("Could not delete file " + file, ex);
        }
    }

    @Override
    public String storeFile(MultipartFile file, String customFileName, String subDirectory) {
        return store(file, customFileName, subDirectory);
    }

    @Override
    public String storeFile(MultipartFile file, String customFileName, String oldFileName, String subDirectory) {
        logger.info("deleting file with fileName: {} isDeleteOldFile: {}", oldFileName,isDeleteOldFile);
        if (isDeleteOldFile) {

            delete(oldFileName);
        }
        return store(file, customFileName, subDirectory);
    }

    @Override
    public List<String> storeFiles(MultipartFile[] files, String customFilePrefix, String subDirectory) {
        List<String> storedFiles = new ArrayList<>();
        for (MultipartFile file : files) {
            storedFiles.add(store(file, customFilePrefix, subDirectory));
        }
        return storedFiles;
    }

    @Override
    public List<String> storeFiles(MultipartFile[] files, String customFilePrefix, List<String> oldFileNames, String subDirectory) {
        if (isDeleteOldFile && !CommonUtils.isNullOrEmptyCollection(oldFileNames)) {
            for (String oldFile : oldFileNames) {
                delete(oldFile);
            }
        }
        List<String> storedFiles = new ArrayList<>();
        for (MultipartFile file : files) {
            storedFiles.add(store(file, customFilePrefix, subDirectory));
        }
        return storedFiles;
    }
}
