package com.mehvi.lady.webapplication.controllers;

import com.mehvi.lady.webapplication.entities.Services;
import com.mehvi.lady.webapplication.entities.Size;
import com.mehvi.lady.webapplication.services.SizeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@RestController
@RequestMapping("/sizes")
@CrossOrigin
public class SizeController {

    private final SizeService sizeService;

    @Autowired
    public SizeController(SizeService sizeService) {
        this.sizeService = sizeService;
    }

    @PostMapping
    public ResponseEntity<Size> createSize(@RequestBody Size size) {
        Size savedSize = sizeService.saveSize(size);
        return new ResponseEntity<>(savedSize, HttpStatus.CREATED);
    }

    @PostMapping("/list")
    public ResponseEntity<List<Size>> createAllSize(@RequestBody List<Size> size) {
        List<Size> savedSize = sizeService.saveAllSizes(size);
        return new ResponseEntity<>(savedSize, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Size> getSizeById(@PathVariable Long id) {
        Optional<Size> size = sizeService.getSizeById(id);
        return size.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping
    public ResponseEntity<List<Size>> getAllSizes() {
        List<Size> sizes = sizeService.getAllSizes();
        return new ResponseEntity<>(sizes, HttpStatus.OK);
    }

    @GetMapping("/v2")
    public ResponseEntity<Page<Size>> getAllSizes(Pageable pageable) {
        Page<Size> sizes = sizeService.getAllSizes(pageable);
        return new ResponseEntity<>(sizes, HttpStatus.OK);
    }


    @GetMapping("/count")
    public ResponseEntity<Long> getSizeCount() {
        long count = sizeService.getSizeCount();
        return new ResponseEntity<>(count, HttpStatus.OK);
    }

    @GetMapping("/exist/{name}")
    public ResponseEntity<Boolean> existSize(@PathVariable String name) {
        boolean exist=sizeService.sizeExists(name);
        return new ResponseEntity<>(exist, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSizeById(@PathVariable Long id) {
        if (sizeService.sizeExists(id)) {
            sizeService.deleteSizeById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Size> putServicesById(@PathVariable Long id, @RequestBody Size requestedSize) {
        Size size = sizeService.getSizeById(id).orElse(null);
        if (Objects.nonNull(size)) {
            size.setName(requestedSize.getName());
            size = sizeService.saveSize(size);
            return new ResponseEntity<>(size, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
