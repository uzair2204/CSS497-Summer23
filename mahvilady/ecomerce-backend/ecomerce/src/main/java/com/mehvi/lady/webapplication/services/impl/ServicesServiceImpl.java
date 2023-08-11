package com.mehvi.lady.webapplication.services.impl;

import com.mehvi.lady.webapplication.entities.Services;
import com.mehvi.lady.webapplication.repositories.ServicesRepository;
import com.mehvi.lady.webapplication.services.ServicesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ServicesServiceImpl implements ServicesService {

    private final ServicesRepository servicesRepository;

    @Autowired
    public ServicesServiceImpl(ServicesRepository servicesRepository) {
        this.servicesRepository = servicesRepository;
    }

    // Save a single services
    @Override
    public Services saveServices(Services services) {
        return servicesRepository.save(services);
    }

    // Save a collection of services
    @Override
    public List<Services> saveAllServices(List<Services> services) {
        return servicesRepository.saveAll(services);
    }

    // Get all services
    @Override
    public Page<Services> getAllServices(Pageable pageable) {
        return servicesRepository.findAll(pageable);
    }

    // Get a services by its ID
    @Override
    public Optional<Services> getServicesById(Long id) {
        return servicesRepository.findById(id);
    }

    // Check if a services with the given ID exists in the database
    @Override
    public boolean servicesExists(Long id) {
        return servicesRepository.existsById(id);
    }

    // Get all services
    @Override
    public List<Services> getAllServices() {
        return servicesRepository.findAll();
    }

    // Get services by a list of IDs
    @Override
    public List<Services> getServicesByIds(List<Long> ids) {
        return servicesRepository.findAllById(ids);
    }

    // Get the total number of services in the database
    @Override
    public long getServicesCount() {
        return servicesRepository.count();
    }

    // Delete a services by its ID
    @Override
    public void deleteServicesById(Long id) {
        servicesRepository.deleteById(id);
    }

    // Delete a single services
    @Override
    public void deleteServices(Services services) {
        servicesRepository.delete(services);
    }


}
