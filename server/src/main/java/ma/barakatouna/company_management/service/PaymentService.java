package ma.barakatouna.company_management.service;

import ma.barakatouna.company_management.model.PaymentDTO;
import org.springframework.stereotype.Service;

import java.util.List;
@Service

public interface PaymentService {
    List<PaymentDTO> findAll();

    PaymentDTO get(Long id);

    Long create(PaymentDTO paymentDTO);

    void update(Long id, PaymentDTO paymentDTO);

    void delete(Long id);

    boolean projetExists(Long id);
}
