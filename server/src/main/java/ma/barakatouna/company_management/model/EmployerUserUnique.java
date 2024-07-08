package ma.barakatouna.company_management.model;

import static java.lang.annotation.ElementType.ANNOTATION_TYPE;
import static java.lang.annotation.ElementType.FIELD;
import static java.lang.annotation.ElementType.METHOD;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Constraint;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import jakarta.validation.Payload;
import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import java.util.Map;
import ma.barakatouna.company_management.service.EmployerService;
import org.springframework.web.servlet.HandlerMapping;


/**
 * Validate that the id value isn't taken yet.
 */
@Target({ FIELD, METHOD, ANNOTATION_TYPE })
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Constraint(
        validatedBy = EmployerUserUnique.EmployerUserUniqueValidator.class
)
public @interface EmployerUserUnique {

    String message() default "{Exists.employer.user}";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};

    class EmployerUserUniqueValidator implements ConstraintValidator<EmployerUserUnique, Long> {

        private final EmployerService employerService;
        private final HttpServletRequest request;

        public EmployerUserUniqueValidator(final EmployerService employerService,
                final HttpServletRequest request) {
            this.employerService = employerService;
            this.request = request;
        }

        @Override
        public boolean isValid(final Long value, final ConstraintValidatorContext cvContext) {
            if (value == null) {
                // no value present
                return true;
            }
            @SuppressWarnings("unchecked") final Map<String, String> pathVariables =
                    ((Map<String, String>)request.getAttribute(HandlerMapping.URI_TEMPLATE_VARIABLES_ATTRIBUTE));
            final String currentId = pathVariables.get("id");
            if (currentId != null && value.equals(employerService.get(Long.parseLong(currentId)).getUser())) {
                // value hasn't changed
                return true;
            }
            return !employerService.userExists(value);
        }

    }

}
