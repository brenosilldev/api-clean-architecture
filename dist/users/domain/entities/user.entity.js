"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserEntity = void 0;
class UserEntity {
    props;
    constructor(props) {
        this.props = props;
        this.props.createdAt = this.props.createdAt ?? new Date();
    }
}
exports.UserEntity = UserEntity;
//# sourceMappingURL=user.entity.js.map