package com.mehvi.lady.webapplication.services;

import com.mehvi.lady.webapplication.entities.Address;
import com.mehvi.lady.webapplication.repositories.AddressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AddressService {

    private final AddressRepository addressRepository;

    @Autowired
    public AddressService(AddressRepository addressRepository) {
        this.addressRepository = addressRepository;
    }

    // Save a single address
    public Address saveAddress(Address address) {
        return addressRepository.save(address);
    }

    // Save a collection of addresses
    public List<Address> saveAllAddresses(List<Address> addresses) {
        return addressRepository.saveAll(addresses);
    }

    // Get an address by its ID
    public Optional<Address> getAddressById(Long id) {
        return addressRepository.findById(id);
    }

    // Check if an address with the given ID exists in the database
    public boolean addressExists(Long id) {
        return addressRepository.existsById(id);
    }

    // Get all addresses
    public List<Address> getAllAddresses() {
        return addressRepository.findAll();
    }

    // Get addresses by a list of IDs
    public List<Address> getAddressesByIds(List<Long> ids) {
        return addressRepository.findAllById(ids);
    }

    // Get the total number of addresses in the database
    public long getAddressCount() {
        return addressRepository.count();
    }

    // Delete an address by its ID
    public void deleteAddressById(Long id) {
        addressRepository.deleteById(id);
    }

    // Delete a single address
    public void deleteAddress(Address address) {
        addressRepository.delete(address);
    }
}
